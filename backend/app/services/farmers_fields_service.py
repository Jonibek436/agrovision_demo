
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[2] / "agrovision.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database():
    with get_connection() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS farmers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT DEFAULT '',
                location TEXT DEFAULT '',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

        db.execute("""
            CREATE TABLE IF NOT EXISTS fields (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                area_hectares REAL NOT NULL,
                crop TEXT NOT NULL,
                farmer_id INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (farmer_id)
                    REFERENCES farmers(id)
                    ON DELETE SET NULL
            )
        """)


def list_farmers():
    with get_connection() as db:
        rows = db.execute(
            "SELECT * FROM farmers ORDER BY id DESC"
        ).fetchall()
        return [dict(row) for row in rows]


def create_farmer(name, phone, location):
    with get_connection() as db:
        cursor = db.execute(
            """
            INSERT INTO farmers (name, phone, location)
            VALUES (?, ?, ?)
            """,
            (name, phone, location)
        )
        farmer_id = cursor.lastrowid

        row = db.execute(
            "SELECT * FROM farmers WHERE id = ?",
            (farmer_id,)
        ).fetchone()

        return dict(row)


def delete_farmer(farmer_id):
    with get_connection() as db:
        cursor = db.execute(
            "DELETE FROM farmers WHERE id = ?",
            (farmer_id,)
        )
        return cursor.rowcount > 0


def list_fields():
    with get_connection() as db:
        rows = db.execute("""
            SELECT
                fields.*,
                farmers.name AS farmer_name
            FROM fields
            LEFT JOIN farmers ON fields.farmer_id = farmers.id
            ORDER BY fields.id DESC
        """).fetchall()

        return [dict(row) for row in rows]


def create_field(name, location, area_hectares, crop, farmer_id):
    with get_connection() as db:
        cursor = db.execute(
            """
            INSERT INTO fields
            (name, location, area_hectares, crop, farmer_id)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, location, area_hectares, crop, farmer_id)
        )

        field_id = cursor.lastrowid

        row = db.execute(
            """
            SELECT
                fields.*,
                farmers.name AS farmer_name
            FROM fields
            LEFT JOIN farmers ON fields.farmer_id = farmers.id
            WHERE fields.id = ?
            """,
            (field_id,)
        ).fetchone()

        return dict(row)


def delete_field(field_id):
    with get_connection() as db:
        cursor = db.execute(
            "DELETE FROM fields WHERE id = ?",
            (field_id,)
        )
        return cursor.rowcount > 0
