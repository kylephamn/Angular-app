import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sqlite3 from 'sqlite3';



const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = dirname(currentFilename);
(globalThis as any).__filename = currentFilename;
(globalThis as any).__dirname = currentDirname;

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());


/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */


// Fetch all colors
app.get('/api/colors', (req, res) => {
  return database.all("SELECT id, name, hex_value FROM colors ORDER BY name", [], (err: Error | null, rows: any[]) => {
    if (err) {
      console.error("Error fetching colors:", err.message);
      return res.status(500).json({ error: "Failed to fetch colors." });
    }
    return res.json(rows);
  });
});

// Add a new color
app.post('/api/colors', (req, res) => {
  const { name, hex_value } = req.body;
  if (!name || !hex_value) {
    return res.status(400).json({ error: 'Color name and hex value are required.' });
  }
  if (!/^#([0-9A-Fa-f]{6})$/.test(hex_value)) {
    return res.status(400).json({ error: 'Invalid hex value format. Must be #RRGGBB.' });
  }

  return database.get("SELECT COUNT(*) AS count FROM colors WHERE name = ? COLLATE NOCASE OR hex_value = ? COLLATE NOCASE", [name, hex_value], (err: Error | null, row: { count: number } | undefined) => {
    if (err) {
      console.error("Error checking uniqueness:", err.message);
      return res.status(500).json({ error: 'Database error during uniqueness check.' });
    }
    if (row === undefined || row.count > 0) {
      return res.status(409).json({ error: 'Color name or hex value already exists.' });
    }

    return database.run(`INSERT INTO colors (name, hex_value) VALUES (?, ?)`, [name, hex_value], function(this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        console.error("Error inserting new color:", err.message);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({ error: 'Color name or hex value already exists (DB constraint).' });
        } else {
          return res.status(500).json({ error: 'Failed to add color to database.' });
        }
      }
      return res.status(201).json({
        id: this.lastID,
        name: name,
        hex_value: hex_value,
        message: "Color added successfully"
      });
    });
  });
});

// Update an existing color
app.put('/api/colors/:id', (req, res) => {
  const id = req.params.id;
  const { name, hex_value } = req.body;
  if (!name || !hex_value) {
    return res.status(400).json({ error: 'Color name and hex value are required.' });
  }
  if (!/^#([0-9A-Fa-f]{6})$/.test(hex_value)) {
    return res.status(400).json({ error: 'Invalid hex value format. Must be #RRGGBB.' });
  }

  return database.get("SELECT COUNT(*) AS count FROM colors WHERE (name = ? COLLATE NOCASE OR hex_value = ? COLLATE NOCASE) AND id != ?", [name, hex_value, id], (err: Error | null, row: { count: number } | undefined) => {
    if (err) {
      console.error("Error checking uniqueness for update:", err.message);
      return res.status(500).json({ error: 'Database error during uniqueness check for update.' });
    }
    if (row === undefined || row.count > 0) {
      return res.status(409).json({ error: 'Color name or hex value already exists for another color.' });
    }

    return database.run(`UPDATE colors SET name = ?, hex_value = ? WHERE id = ?`, [name, hex_value, id], function(this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        console.error("Error updating color:", err.message);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({ error: 'Color name or hex value already exists (DB constraint).' });
        } else {
          return res.status(500).json({ error: 'Failed to update color in database.' });
        }
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Color not found." });
      } else {
       return res.json({
          id: id,
          name: name,
          hex_value: hex_value,
          message: "Color updated successfully"
        });
      }
    });
  });
});
// Delete a color
app.delete('/api/colors/:id', (req, res) => {
  const id = req.params.id;

  return database.get("SELECT COUNT(*) AS count FROM colors", [], (err: Error | null, row: { count: number } | undefined) => {
      if (err) {
          console.error("Error checking color count for deletion:", err.message);
          return res.status(500).json({ error: 'Database error during count check for deletion.' });
      }
      if (row === undefined || row.count <= 2) {
          return res.status(400).json({ error: 'Cannot delete color. At least 2 colors must remain.' });
      }

      return database.run(`DELETE FROM colors WHERE id = ?`, id, function(this: sqlite3.RunResult, err: Error | null) {
          if (err) {
              console.error("Error deleting color:", err.message);
              return res.status(500).json({ error: 'Failed to delete color from database.' });
          }
          if (this.changes === 0) {
              return res.status(404).json({ error: "Color not found." });
          } else {
              return res.json({ id: id, message: "Color deleted successfully" });
          }
      });
  });
});


/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);


//SQLite database setup and initilization
const sqlite3Instance = (sqlite3 as any).default;
const database = new sqlite3Instance.Database('./my_colors.db',sqlite3Instance.OPEN_READWRITE | sqlite3Instance.OPEN_CREATE, (err: Error | null) =>{
  if(err){
    console.error('Error connecting to SQLite database:', err.message);
  } 
  else {
    console.log('Connected to SQLite database');
    database.serialize(() => {
      database.run(`CREATE TABLE IF NOT EXISTS colors(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, hex_value TEXT NOT NULL UNIQUE)`,(err: Error | null) =>{
          if (err){
            console.error("Error creating colors table:", err.message);
          }else{
            console.log("Colors table ensured(created or already exists).");
            database.get("SELECT COUNT(*) AS count FROM colors", [], (err: Error | null, row: {count:number} | undefined) =>{
              if (err){
                console.error("Error checking color count:", err.message);
                return;
              }
              if (row === undefined || row.count === 0) {
                console.log("Table is empty, inserting initial colors...");
                const initialColors = [
                  {
                    name: 'Red', hex_value: '#FF0000'
                  },
                  {
                    name: 'Blue', hex_value: '#0000FF'
                  },
                  {
                    name: 'Green', hex_value: '#008000'
                  },
                  {
                    name: 'Yellow', hex_value: '#FFFF00'
                  },
                  {
                    name:'Orange', hex_value: '#FFA500'
                  },
                  {
                    name:'Purple', hex_value: '#800080'
                  },
                  {
                    name: 'Pink', hex_value: '#FFC0CB'
                  },
                  {
                    name: 'Brown', hex_value: '#A52A2A'
                  },
                  {
                    name: 'Teal', hex_value: '#008080'
                  },
                  {
                    name: 'Black', hex_value: '#000000'
                  }
                ];
                database.serialize(() => {
                  const stmt = database.prepare("INSERT INTO colors (name, hex_value) VALUES (?, ?)");
                  initialColors.forEach(color => {
                    stmt.run(color.name, color.hex_value, function(this:sqlite3.RunResult, err: Error | null){
                      if(err && !err.message.includes("UNIQUE constraint failed")){
                        console.error(`Error inserting ${color.name}: ${err.message}`);
                      }
                    });
                  });
                  stmt.finalize(() => {
                    console.log("Initial colors insertion attempt finished.");

                  });
                });
              } else{
                console.log(`Colors table already contains ${row.count} colors.`);
              }
            });
          }
        });
    });
  }

});

// closes the database connection gracefully
process.on('SIGINT', () => {
  database.close((err: Error | null) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else{
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
