# crowdin-cli-tool [![Supporting](https://github.com/Cado-Labs/cado-labs-logos/blob/main/cado_labs_badge.png)](https://github.com/Cado-Labs/)

---

<p>
  <a href="https://github.com/Cado-Labs">
    <img src="https://github.com/Cado-Labs/cado-labs-logos/blob/main/cado_labs_supporting.svg" alt="Supported by Cado Labs" />
  </a>
</p>

---

## Инициализация

`crowin init --token <crowdin_token>`

Где `<crowdin_token>` - api token сгенерированный в crowdin профиле с `access all`

## Команды

`init` - Сохраняет токен в конфиге который созадется в директории выполнения команды

`lint` - Проверяет синтаксис переводов 

`push-diff` - Выгружает дифф переводов (Не работает в мастер ветке)

`pull-diff` - Скачивает дифф переводов (Не работает в мастер ветке)

`upload-source` - Выгружает только source файл

`upload-translations` - Выгружает только переводы (обязательна выгрузка source перед этим)

`upload/push` - Выгружает source и переводы (Выполняет по очереди `upload-source` и `upload-translations`)

`download/pull` - Скачивает все переводы

`task` - Создает задачу в crowdin

`clean` - Удаляет ветку в crowdin

`sync` - Выгружает source, переводы, а затем загружает обратно

Запускать `crowdin <command>`

## Параметры

`-v/--version` - Отображает версию

`-h/--help` - Отображает справку

`-b/--branch` - crowdin ветка

`-c/--config` - путь к файлу конфигурации

`-l/--languages` - Список языков через запятую (по умолчанию все). Прим crowdin upload -l "ru, en, fr"

`--silent` - Выводит логи построчно, без анимаций

`--token` - сгенерированный в crowdin api-токен

`--organization` - Название организации в crowdin enterprise

`--fix` - При выполнении команды `lint` не логироет ошибки, а исправляет их. ВНИМАНИЕ! ЭТО УДАЛИТ И ВЕТКУ В CROWDIN!

`--diff-with` - При выполнении команд `push` и `push-diff` дифф создастся с переданным коммитом/тэгом

`--project-id` - Id проекта в crwodin

`--base-dir` - См. 'Конфигурация'

`--path` - См. 'Конфигурация'

`--use-git-branch-as-default` - См. 'Конфигурация'

`--import-eq-suggestions` - См. 'Конфигурация'

`--auto-approve-imported` - См. 'Конфигурация'

`--skip-untranslated-strings` - См. 'Конфигурация'

`--skip-format-step` - См. 'Конфигурация'

`--contributors` - См. 'Конфигурация'

## Конфигурация

Конфиг должен находиться в директории запуска или выше.

При инициализации создается конфиг с api-токеном в домашней директории.

Дальше можно править его или добавить в каждый проект. Параметры которых нет в конфиге проекта будут искаться в глобальном.

```
{
  // Обязательные параметры
  "token": string, // сгенерированный в crowdin api-токен, по умолчанию в глобальном конфиге
  "organization": string, // Название организации в crowdin enterprise
  "projectId": string, // Id для проекта в crwodin
  "baseDir": string, // Путь к переводам проета, относительно текущего конфига или абсолютный.
  "path": string, // Путь к файлам переводов относительно 'baseDir'. Структура файлов и папок будет сохранена в crowdin.
  // Разрешено использовать glob syntax.
  // Имя файла должно содержать переменную указывающую на локаль
  // %{id/name/editorCode/twoLettersCode/threeLettersCode/locale/androidCode/osxLocale}
  // Прмер './config/**/locale_prefex.%{twoLettersCode}.yml'
  // Для файлов 'config/dir1/locale_prefex.en.yml', 'config/dir1/locale_prefex.ru.yml'

  // Не обязательные параметры
  "useGitBranchAsDefault": boolean, // Использует по умолчанию гит-ветку.
  // Если параметр включен блокирует выгрузки 'master' ветки
  // Игнорируется если передан параметр `-b/--branch`
  "importEqSuggestions": boolean, // Импортирует в crwodin переводы аналогиченые source переводам
  "autoApproveImported": boolean, // Автоматически помечает выгруженные переводы как получившие апрув на пруфридинге
  "skipUntranslatedStrings": boolean, // Пропускает в билде ключи без перевода
  "contributors": string[], // Список пользователей через запятую на которыx в crowdin будут ставиться задачи
  "translateHidden": boolean, // Выгружать переводы к скрытым строками
  "skipAssignedStrings": boolean, // Ставить таск только к новым ключам
  "exportWithMinApprovalsCount": number, // Сколько апрувов должно быть на переводе чтобы он попал в экспорт
  "skipFormatStep": boolean, // пропустит этап форматирования переводов после pull (актуально для старых проектов)
}
```
