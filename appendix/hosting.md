# Бесплатный сайт и исходники книги

Книга публикуется как статический сайт на GitHub Pages. Сборщик — [HonKit](https://honkit.netlify.app/), открытый fork классического GitBook. Он строит HTML из Markdown и `SUMMARY.md`; подписка GitBook и внешний поисковый сервис не нужны.

Исходники: [kanoyo-git/baldic-docs](https://github.com/kanoyo-git/baldic-docs). Репозиторий содержит документацию, оформление и workflow публикации. Игровые DLL, личные пути, тестовые профили и закрытый исходный код проекта в него не включаются.

## Локальная сборка

Автору сайта нужен Node.js22+; CI использует Node24. Из корня репозитория документации:

```sh
npm ci
npm run check
npm run build
npm run serve
```

`check` проверяет главы, навигацию и внутренние ссылки. `build` создаёт `_site/`, `serve` открывает локальную версию. `_site` и node_modules не коммитятся.

## GitHub Pages

Workflow `.github/workflows/pages.yml` собирает книгу после push в `main`, проверяет её и публикует HTML через официальный Pages artifact. В Settings → Pages выбран источник GitHub Actions. Ручной запуск доступен через workflow_dispatch.

На GitHub Free для Pages нужен публичный репозиторий. Стандартный адрес проекта: `https://kanoyo-git.github.io/baldic-docs/`. Собственный домен необязателен. [Условия GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Изменение глав

Редактируйте Markdown и добавляйте страницу в SUMMARY один раз. Ссылки между главами остаются относительными и внутри книги; исходные `.md` при сборке становятся страницами сайта. После изменения API reference обновляйте подписи из соответствующих source-built assemblies, а не по памяти.

C#-примеры предназначены для игровых проектов, не для Node. Их компиляция требует SDK/game references и проверяется отдельно; публичная сборка сайта не требует владения игрой или скачивания её DLL.

Markdown можно сохранить как архив для импорта в GitBook; `SUMMARY.md` задаёт навигацию и там. Если используется Git Sync с подпапкой книги, `.gitbook.yaml` задаёт её content root. [Конфигурация GitBook](https://gitbook.com/docs/docs-as-code/git-sync/content-configuration).
