#!/usr/bin/env python3
"""Build reviewable per-report cards from the checked research and code snapshot.

No network, application writes, or regulatory inference. Fails on incomplete coverage.
"""
import hashlib
import json
import os
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'docs/report-reference'
REG = ROOT / 'docs/regulatory-requirements'
catalog = json.loads((REF / 'code-catalog.json').read_text())
active = {r['code']: r for r in catalog['reports']}
reports, sources, groups = {}, {}, {}
for file in sorted((REF / 'research').glob('*.json')):
    data = json.loads(file.read_text())
    groups[data['group']] = data
    for source in data['sources']:
        assert source['id'] not in sources, f"Duplicate source ID: {source['id']}"
        assert source['url'].startswith('https://'), source['id']
        if source.get('local_file'):
            assert (ROOT / source['local_file']).is_file(), source['local_file']
        sources[source['id']] = {**source, 'checked_on': data['checked_on'], 'group': data['group']}
    for report in data['reports']:
        assert report['code'] not in reports, f"Duplicate report: {report['code']}"
        reports[report['code']] = {**report, 'group': data['group'], 'checked_on': data['checked_on']}
assert set(reports) == set(active), f"Coverage mismatch: missing={set(active)-set(reports)}, extra={set(reports)-set(active)}"
for report in reports.values():
    for source_id in report['source_ids'] + report['example_source_ids']:
        assert source_id in sources, (report['code'], source_id)

def link(origin, target, label):
    return f'[{label}]({quote(os.path.relpath(target, origin.parent), safe="/.-_")})'

def stringify(value):
    return value if isinstance(value, str) else json.dumps(value, ensure_ascii=False)

def bullets(items):
    return ['- ' + stringify(x) for x in items] if items else ['- Не установлено в этом проходе; не подменять догадкой.']

def historical_section(items, origin, heading='## Наблюдения исходного снимка до CATALOG-01'):
    if not items:
        return []
    return [heading, '',
        'Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. '
        + link(origin, ROOT / 'docs/planning/BACKLOG.md', 'Задачи и статусы — BACKLOG') + '.', '',
        *bullets(items), '']

def ui_title(implementation):
    return (implementation.get('user_facing') or {}).get('title') or implementation['name']

def source_line(source_id, origin):
    s = sources[source_id]
    local = ' ' + link(origin, ROOT / s['local_file'], 'Локальный материал') + '.' if s.get('local_file') else ''
    return f"- **{source_id}** [{s['title']}]({s['url']}) — {s['publisher']}; {s.get('version_or_date', 'версия не установлена')}; доступ: {s.get('access', 'не указан')}.{local} {s.get('notes', '')}"

def example_summary(report, origin):
    summary = report.get('examples_summary')
    if not summary:
        return []
    lines = ['### Локальный инженерный пример', '', summary['description'], '']
    for artifact in summary['artifacts']:
        target = ROOT / artifact['path']
        assert target.is_file(), artifact['path']
        lines.append('- ' + link(origin, target, artifact['label']))
    return lines + ['']

def save(path, lines):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text('\n'.join(lines) + '\n')

for code, report in sorted(reports.items()):
    implementation = active[code]
    card = REG / 'reports' / f'{code}.md'
    example = REF / 'examples' / code / 'README.md'
    research = REF / 'research' / f"{report['group']}.json"
    lines = [f"# {code} — {ui_title(implementation)}", '',
        f"Проверено: **{report['checked_on']}**. Категория: `{report['classification']}`. Семейство: {report['family']}.", '',
        'Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.', '',
        '## Статус и применимость', '', stringify(report['normative_status']), '', stringify(report['applicability']), '',
        '## Выдаваемый результат', '', stringify(report['deliverable']), '',
        '## Входные данные', '', *bullets(report['required_inputs']), '',
        '## Проверки и контрольные вопросы', '',
        'Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.', '',
        *bullets(report['validation_rules']), '', '## Проверка человеком', '', *bullets(report['human_review']), '',
        '## Риски текущего интерфейса и пробелы реализации', '', *bullets(report['ui_warnings'] + report['implementation_gaps']), '',
        *historical_section(report.get('historical_findings', []), card),
        '## Примеры', '', link(card, example, 'Материалы и статус эталона для этого типа'), '', stringify(report['example_notes']), '',
        *example_summary(report, card),
        '## Источники', '', *[source_line(s, card) for s in report['source_ids']], '',
        '## Сопоставление с кодом', '',
        f"Название в интерфейсе: **{ui_title(implementation)}**. Внутреннее имя шаблона: `{implementation['name']}`.", '',
        f"В реестре кода: {implementation['field_count']} уникальных полей, {implementation['required_count']} помечены required. Это текущее поведение, не подтверждение нормативной полноты.", '',
        link(card, ROOT / implementation['source_path'], 'Эффективный шаблон в коде') + ' · ' + link(card, REF / 'code-catalog.json', 'Снимок полей и версий') + ' · ' + link(card, research, 'Редактируемое исследование'), '',
        'Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.']
    save(card, lines)
    lines = [f'# Образцы: {code}', '', f"Дата проверки: {report['checked_on']}. Статус материала: **{report['example_status']}**.", '',
        stringify(report['example_notes']), '', *example_summary(report, example), '## Доступные ориентиры', '',
        *([source_line(s, example) for s in report['example_source_ids']] if report['example_source_ids'] else ['Публичный универсальный эталон не установлен. Требуется конкретная форма/доступ/решение получателя, указанное в нормативной карточке.']), '',
        '## Как использовать', '',
        '- Сначала сопоставить страну, период, редакцию, объект и границы с нашим кейсом.',
        '- Официальная форма задаёт структуру только для своей схемы и версии. Публичный заполненный отчёт показывает один конкретный случай.',
        '- Не переносить чужие цифры, подписи, логотипы проверки и утверждения о сертификации в наш результат.',
        '- Для проверки расчёта нужны исходные данные, коэффициенты и ожидаемый результат; одного красивого PDF недостаточно.',
        '- Статус golden test: **не утверждён**. Отдельно согласовать контракт и критерии численной/содержательной приёмки.', '',
        link(example, card, 'Требования и ограничения этого типа') + ' · ' + link(example, REG / 'RULE_MODEL.md', 'Контракт будущего E2E'), '',
        'Карточка сформирована из исследования; не редактировать параллельную копию фактов.']
    save(example, lines)

catalog_path = REF / 'CATALOG.md'
lines = ['# Каталог отчётов и материалов', '',
    f"Инвентаризация {catalog['captured_on']}: **{len(active)} активных кодов**, {len(catalog['type_only_codes'])} дополнительных кодов только в union-типаx. Реестр не является обязательством поддерживать все виды в первом релизе.", '',
    'Каждый активный код имеет карточку требований и карточку примеров. Наличие карточки означает охват сбором, а не завершённую реализацию или утверждённый нормативный эталон.', '',
    '| Код | Название в интерфейсе | Внутреннее имя в коде | Категория | Требования | Образцы |', '| --- | --- | --- | --- | --- | --- |']
for code, r in sorted(reports.items()):
    lines.append(f"| `{code}` | {ui_title(active[code])} | {active[code]['name']} | {r['classification']} | {link(catalog_path, REG/'reports'/f'{code}.md', 'Карточка')} | {link(catalog_path, REF/'examples'/code/'README.md', r['example_status'])} |")
lines += ['', '## Alias и неактивные заготовки', '',
    'Следующие коды объявлены в TypeScript, но не зарегистрированы как самостоятельные активные шаблоны. Это не автоматически подтверждённые aliases: перед объединением проверить mapping движка рекомендаций.', '',
    ', '.join(f'`{x}`' for x in catalog['type_only_codes']), '',
    '`ISO14067` и `ISO_14067` оба активны, но имеют разные наборы полей. Эффективный `CBAM` переопределяет generated-вариант в главном реестре. У generated EPD/PCF/ISO-подобных наборов совпадение полей не подтверждает одинаковую методику.', '',
    link(catalog_path, REF/'code-catalog.json', 'Точный снимок эффективного реестра')]
save(catalog_path, lines)

source_path = REF / 'SOURCES.md'
research_dates = sorted({data['checked_on'] for data in groups.values()})
lines = ['# Реестр первичных источников', '',
    f"{len(sources)} записей источников; даты проверки: {', '.join(research_dates)}. Доступность страницы, полнота чтения и право коммерческого воспроизведения — разные вопросы; ограничения указаны в notes.", '']
for group in sorted(groups):
    lines += ['## ' + group, '']
    lines += [source_line(s['id'], source_path) for s in sources.values() if s['group'] == group]
    lines += ['']
save(source_path, lines)
(REF/'sources.json').write_text(json.dumps(list(sources.values()), ensure_ascii=False, indent=2)+'\n')

gap_path = REG/'GAPS.md'
lines = ['# Что ещё не позволяет заявлять нормативную готовность', '',
    'Это результаты первичного сбора. Задачи и статусы реализации ведутся в BACKLOG; этот список не является второй рабочей очередью.', '',
    '## Общие ограничения', '',
    '- Нет завершённого выпуска отчёта и утверждённого контрольного расчёта в проверенном приложении.',
    '- Нужны проверка применимости по стране/периоду, лицензированные стандарты при необходимости, mapping полей, расчёты, evidence и проверки человека.',
    '- Скачанные образцы имеют собственную редакцию и область действия; часть относится к архивным периодам.',
    '- Нельзя представлять подготовленный пакет как выданный внешней организацией сертификат, рейтинг или подтверждение подачи.', '',
    '## Существенные находки по семействам', '']
for group, data in sorted(groups.items()):
    lines += ['### '+group, '', *bullets(data.get('findings', [])), '']
    lines += historical_section(data.get('historical_findings', []), gap_path, '#### Наблюдения до CATALOG-01')
lines += ['## Остаток по каждому коду', '', '| Код | Риски и недостающее |', '| --- | --- |']
for code, r in sorted(reports.items()):
    gap='; '.join(stringify(x) for x in r['ui_warnings']+r['implementation_gaps']).replace('|','/').replace('\n',' ')
    lines.append(f"| {link(gap_path, REG/'reports'/f'{code}.md', code)} | {gap} |")
save(gap_path, lines)

assets=[]
for file in sorted((REF/'assets').rglob('*')):
    if not file.is_file() or file.suffix.lower() in ['.json','.jpg','.jpeg','.png','.md']:
        continue
    content=file.read_bytes()
    local=str(file.relative_to(ROOT))
    matched=[s['id'] for s in sources.values() if s.get('local_file') == local]
    assets.append({'path':local,'bytes':len(content),'sha256':hashlib.sha256(content).hexdigest(),'source_ids':matched})
(REF/'assets-index.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
summary={'catalog_captured_on':catalog['captured_on'],'research_checked_on':research_dates,'active_codes':len(active),'requirements_cards':len(reports),'example_cards':len(reports),'source_records':len(sources),'downloaded_materials':len(assets),'downloaded_bytes':sum(a['bytes'] for a in assets),'type_only_codes':len(catalog['type_only_codes']),'coverage':'all active code templates; first-pass source review, not normative approval'}
(REF/'coverage.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))
