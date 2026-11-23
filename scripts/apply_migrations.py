import os, re, sys, pathlib
import psycopg

ROOT = pathlib.Path(__file__).resolve().parent.parent
env_path = ROOT / ".env.local"
cfg = {}
with open(env_path, encoding="utf-8") as f:
    for line in f:
        m = re.match(r'^([A-Z0-9_]+)="?(.*?)"?\s*$', line)
        if m:
            cfg[m.group(1)] = m.group(2)

url = cfg["DIRECT_URL"]
mig_dir = ROOT / "supabase" / "migrations"
files = sorted(mig_dir.glob("*.sql"))
dry = "--apply" not in sys.argv

print("dry_run" if dry else "apply", "migrations:", len(files))
with psycopg.connect(url, connect_timeout=30) as conn:
    try:
        for path in files:
            sql = path.read_text(encoding="utf-8")
            print("running", path.name)
            conn.execute(sql)
            if dry:
                print("  ok (will rollback)")
        if dry:
            conn.rollback()
            print("DRY_RUN_OK rolled_back")
        else:
            for path in files:
                version = path.name.split("_", 1)[0]
                conn.execute(
                    "insert into supabase_migrations.schema_migrations(version, name) values (%s, %s) on conflict (version) do nothing",
                    (version, path.stem),
                )
            conn.commit()
            print("APPLY_OK committed")
    except Exception as exc:
        conn.rollback()
        print("FAILED:", type(exc).__name__, str(exc)[:800])
        raise

