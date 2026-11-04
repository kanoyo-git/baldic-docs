# Команды автора

В командах `tools/baldic.py` означает инструмент из исходников или распакованного author release. Запускайте его из корня соответствующего комплекта либо используйте полный путь. Пути ниже — placeholders, не готовые каталоги пользователя.

| Команда | Назначение |
|---|---|
| `doctor` | Проверить локальные build/game prerequisites |
| `deps` | Получить проверяемые зависимости сборки самого проекта |
| `build`, `test` | Сборка/проверка Loader и API из исходников |
| `package --output PATH` | Платформенные поставки в выбранный каталог |
| `install GAME --release RELEASE` | Проверяемая установка из поставки |
| `restore GAME` | Восстановление по записи установки |
| `create MOD --id ID` | Новый Loader-only проект |
| `create MOD --id ID --api --target-game bbplus\|bbcr` | Проект с выбранным game API |
| `mod-build MOD` | Сборка потребителя |
| `check MOD` | Проверка корня/архива и declarations |
| `mod-package MOD --output FILE.baldic` | Проверка и упаковка собственного мода |
| `prepare-sdk MOD --output SDK` | Локальные преобразованные compile references |
| `setup-ide MOD --target-game GAME` | Задачи VS Code, сохраняющие unrelated tasks |
| `datagen GENERATOR.dll --output DIR` | Детерминированные данные из author-time generator |
| `dev-run MOD --target-game GAME` | Изолированный запуск выбранного набора |
| `game-test MOD --target-game GAME` | Изолированные cooperative coroutine tests |
| `import-config SOURCE --output DEST` | Явный импорт поддерживаемых TOML значений |
| `import-resources SOURCE --output DEST` | Копирование только ресурсных файлов |

## SDK и зависимости

```sh
python3 tools/baldic.py prepare-sdk /path/to/mod \
  --target-game bbplus \
  --dependency /path/to/baldic-api-bbplus.baldic \
  --dependency /path/to/library.baldic \
  --managed /path/to/BBPlus/BALDI_Data/Managed \
  --output /path/to/fresh-sdk
```

Каталог output должен быть новым. В нём остаются локальные преобразованные game references и manifest их происхождения. DLL игры не включаются в архив мода и не публикуются вместе с книгой.

## Native run

```sh
python3 tools/baldic.py dev-run /path/to/mod --target-game bbcr \
  --api-archive /path/to/baldic-api-bbcr.baldic \
  --dependency /path/to/library.baldic --headless --timeout 180
```

`--api-archive` выбирает архив API для launch; `--no-api` запускает bare setup. `--loader` позволяет закрепить host. `--scene MainMenu` — штатный default native flow; пустое значение не выбирает сцену. Linux headless требует gamescope и реальную поддержку GPU. Тесты ограничиваются внешним timeout и своим cooperative deadline.

`run`/`dev-run`/`game-test` не являются командой горячей замены живого DLL. Они используют контролируемую установку. [Подробности инструментов](../loader/tooling.md).

## Переменные окружения

| Переменная | Что указывать |
|---|---|
| `BALDIC_LOADER_DLL` | Текущий `BepInEx/core/Baldic.Loader.dll` |
| `BALDIC_GAME_DIR` | Read-only игра BB+ |
| `BALDIC_BBCR_GAME_DIR` | Read-only игра BBCR |
| `BALDIC_API_DIR` | Извлечённые BB+ API DLL |
| `BALDIC_API_BBCR_DIR` | Извлечённые BBCR API DLL |
| `BALDIC_SDK_DIR` | Каталог `sdk/msbuild` из поставки |
| `BALDIC_API_ARCHIVE` | Архив API для задач SDK/launch |
| `BALDIC_DATAGEN_DLL` | Author-time контракт datagen tool |

Не смешивайте `BALDIC_API_DIR` и `BALDIC_API_BBCR_DIR` в одном игровом проекте. Для нового CLI-проекта выберите `--target-game`, а не подменяйте DLL одной игры библиотеками другой.
