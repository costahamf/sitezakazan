SkillPlus — экспорт расписания из Excel в JSON

Что это:
- Вы заполняете Excel (data/schedule.xlsx).
- Скрипт конвертирует его в JSON (assets/data/schedule.flat.json).
- Страница schedule.html читает JSON и строит таблицу + фильтры.

1) Куда положить Excel
Внутри папки сайта создайте папку:
  data/
и положите туда файл:
  data/schedule.xlsx

Можно взять шаблон:
  SkillPlus_Schedule_Template.xlsx
и сохранить как:
  data/schedule.xlsx

2) Как заполнять Excel (лист SCHEDULE)
Каждая строка = одно занятие.
Важные поля:
- City (город)
- Direction (Индивидуальное / Командное)
- District (район)
- Branch (филиал/адрес)
- AgeFrom / AgeTo (возраст)
- Day (день недели) — можно по-русски: Понедельник, Вторник ... (или ПН/ВТ/...)
- StartTime / EndTime (время) — формат HH:MM
- Active — 1 (показывать) или 0 (скрыть)

3) Как запустить экспорт
В корне проекта (где index.html) выполните:

Windows:
  py -m pip install openpyxl
  py tools\excel_to_json.py

macOS/Linux:
  python3 -m pip install openpyxl
  python3 tools/excel_to_json.py

Опция (если нужен grouped JSON для отладки):
  python3 tools/excel_to_json.py --grouped

4) Что получится на выходе
- assets/data/schedule.flat.json  (основной файл для сайта)
- assets/data/schedule.grouped.json (если запускали с --grouped)

5) Важно при локальном тестировании
Если schedule.html делает fetch() к JSON, то при открытии file:// может не работать.
Запускайте локальный сервер:

  python3 -m http.server 8000
и открывайте:
  http://localhost:8000/


Дни недели в Excel (колонка Day) вводите сокращённо: Пн., Вт., Ср., Чт., Пт., Сб., Вс. (точка допускается).
