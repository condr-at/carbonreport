import pathlib
import re

# 1. Read Matrix Headers
matrix_path = pathlib.Path('docs/data points guide/datapoints-reports matrix.csv')
if matrix_path.exists():
    matrix_content = matrix_path.read_text()
    # Assuming first line is header and separated by semicolon
    header_line = matrix_content.splitlines()[0]
    # Filter out empty strings and the first column 'data_point' if it exists
    matrix_fields = [h.strip() for h in header_line.split(';') if h.strip() and h.strip() != 'data_point']
else:
    print('Matrix file not found')
    matrix_fields = []

# 2. Read Plan Fields
plan_path = pathlib.Path('docs/data points guide/data points expansion plan.md')
if plan_path.exists():
    plan_content = plan_path.read_text()
    # Extract snake_case words inside backticks
    # We look for `word` where word starts with a letter and contains letters, numbers, or underscores
    plan_fields = set(re.findall(r'`([a-z][a-z0-9_]+)`', plan_content))
else:
    print('Plan file not found')
    plan_fields = set()

# 3. Read DB Fields
db_path = pathlib.Path('prisma/seed-data/dataset-fields.ts')
if db_path.exists():
    db_content = db_path.read_text()
    # Extract fieldId: '...'
    db_fields = set(re.findall(r"fieldId:\s*['\"]([a-z0-9_]+)['\"]", db_content))
else:
    print('DB file not found')
    db_fields = set()

# Analysis
matrix_set = set(matrix_fields)

# Fields in Matrix but NOT in Plan (Potential typos or undocumented fields)
matrix_not_in_plan = matrix_set - plan_fields

# Fields in Matrix but NOT in DB (Not implemented yet - expected, but good to know count)
matrix_not_in_db = matrix_set - db_fields

# Fields in Plan but NOT in Matrix (Planned but not used in reports yet?)
plan_not_in_matrix = plan_fields - matrix_set

print(f'Total fields in Matrix: {len(matrix_fields)}')
print(f'Total fields in Plan: {len(plan_fields)}')
print(f'Total fields in DB: {len(db_fields)}')

print('\n--- Fields in Matrix but NOT in Plan (Undocumented or Typo) ---')
for f in sorted(matrix_not_in_plan):
    print(f)

print('\n--- Fields in Matrix that match Plan ---')
print(f'Count: {len(matrix_set & plan_fields)}')

print('\n--- Fields in Matrix that match DB ---')
print(f'Count: {len(matrix_set & db_fields)}')

print('\n--- Fields in Plan but NOT in Matrix (Potential missing columns in Matrix) ---')
for f in sorted(plan_not_in_matrix):
    print(f)
