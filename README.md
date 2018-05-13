# Webpack Starter Kit

**Webpack Starter Kit** - стартовый шаблон для работы со сборщиком Webpack, включающий множество плагинов и их конфигурацию для быстрой и удобной работы.

Содержит две версии запуска: `development` (запускает локальный сервер для разработки) и `production` (создает папку `build`, в которую складывает итоговые файлы).

**Функции и возможности:**

`common`

* основан на последней версии `webpack@4.8.1`
* позволяет быстро начать работу с webpack, правильно работает с html, css и js
* поддерживает изображения, шрифты и сторонние библиотеки
* компилирует Sass в CSS
* содержит удобные Sass `@mixin`
* автоматически добавляет вендорные префиксы на основе базы [caniuse](https://caniuse.com/)
* поддерживает babel

`development`

* запускает локальный сервер с livereload

`production`

* минифицирует css и js файлы
* настраиваемая автоматическая оптимизация изображений (поддерживает форматы gif, png, jpg, jpeg и svg)

## Начало работы

#### Установка

* `git clone https://github.com/vladyslav-dmitriev/webpack-starter-kit`
* `npm install`

#### Запуск

* development - `npm run start`
* production - `npm run build`

## Плагины и загрузчики


#### Конфигурация

* [webpack v4.8.1](https://github.com/webpack/webpack) - последняя актуальная версия на 13.05.2018
* [webpack-cli](https://www.npmjs.com/package/webpack-cli) - берет опции через инструмент CLI, а также через файл конфигурации и передает их в webpack для сборки
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server) - встроенный локальный сервер и livereload, рекомендуется в официальной документации
* [rimraf](https://github.com/isaacs/rimraf) - очистка папки `build` перед сборкой production версии
* [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) - копирует статические файлы и напрямую вставляет в указанное место
  
#### HTML

* [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) - создание html-файлов и работа с шаблонами 
* [html-loader](https://github.com/webpack-contrib/html-loader) - загрузка html в свой javascript
  
#### CSS  

* [css-loader](https://github.com/webpack-contrib/css-loader) - добавление CSS модулей в граф зависимостей
* [style-loader](https://github.com/webpack-contrib/style-loader) - добавление css-кода в DOM-дерево в тег `˂style˃`
* [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) - вынос подключаемого css-кода в отельные файлы
* [postcss-loader](https://github.com/postcss/postcss-loader) - подключение в проект ~~препроцессора~~ ~~постпроцессора~~ процессора PostCSS 
* [autoprefixer](https://github.com/postcss/autoprefixer) - автоматическое добавление вендорных префиксов
* 
#### Sass

* [sass-loader](https://github.com/webpack-contrib/sass-loader) - компиляция Sass в CSS
* [node-sass](https://github.com/sass/node-sass) - зависимость для sass-loader, комилирует Sass в CSS

#### Шрифты и изображения

* [file-loader](https://github.com/webpack-contrib/file-loader) - нужен для того, чтобы webpack мог работать с картинками как с модулями (сканирует все файлы и пытается загрузить их в папку `build`)
* [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) - оптимизация изображения

#### Javascript

* [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) - встроенный в webpack плагин, автоматически загружает модули (вместо постоянного `import` и `require`)
* [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) - минимизация js-файлов
* [babel-core](https://www.npmjs.com/package/babel-core), [babel-loader](https://github.com/babel/babel-loader), [babel-preset-env](https://www.npmjs.com/package/@babel/preset-env) - установка babel для webpack

## Документация

### Настройка установленных плагинов

#### Autoprefixer

В файле `package.json` вот эти строки:

```javascript
"browserslist": [
  "> 3%",
  "last 10 versions"
],
```

#### Cжатие изображений

В файле `webpack.config.json` в опциях loader'а `image-webpack-loader`.


#### CopyWebpackPlugin

При возникновении необходимости напрямую скопировать файлы из папки 'src' в 'build' используется плагин `CopyWebpackPlugin`, здесь по-умолчанию он копирует папку `libs`, его настройки содержаться в файле `webpack.config.json`:

```javascript
new CopyWebpackPlugin([{
  from: './src/libs',
  to: 'libs'
}]),
```

### Подключение сторонних библиотек

Не все javascript библиотеки совместимы и могут напрямую использоваться с webpack. Поэтому далее представлены способы подключения сторонних библиотек.

#### ProvidePlugin для введения неявных глобальных переменных

Webpack анализирует код и автоматически включает необходимые модули. Например, при виде в коде идентификатора jQuery `$`, webpack сам подставляет в файл строку `var $ = require("jquery");`

Для этого встроенный по-умолчанию в webpack плагин ProvidePlugin нужно настроить следующим способом:

```javascript
plugins:[
  new webpack.ProvidePlugin({
    $: "jquery/dist/jquery.min.js",
    jQuery: "jquery", // можно и так
    "window.jQuery": "jquery/dist/jquery.min.js"
})]
```

#### Явное указание пути для импорта

Можно импортировать объявления примерно так:

```javascript
import SomeComponent from 'app/lib/javascriptLib/dist/SomeComponent.min.js'; // так
import SomeComponent from '../dist/SomeComponent.min.js'; // или даже так
```

#### Использование imports-loader для конфигурации this

Устаревшие библиотеки полагаются на this будучи window объектом и это является проблемой, когда библиотека запускается в контексте CommonJS, где this равносильно module.exports. 

```javascript
module: {
  loaders: [
    {
      test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
      loader: "imports?this=>window"
    }
  ]
} 
```

#### Использование imports-loader для отключения AMD

Импорт следующим образом поддерживает различные стили модулей, такие как AMD, CommonJS.

```javascript
module: {
  loaders: [
    {
      test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
      loader: "imports?define=>false"
    }
  ]
}
```

#### Использование script-loader для глобального импорта библиотек

Этот прием загрузки равносилен тому, как если бы загрузка происходила через тег `<script>`. Файл скрипта добавляется в бандл как строка и не минимизируется webpack-ом.

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.exec.js$/,
        use: [ 'script-loader' ]
      }
    ]
  }
}

import exec from 'script.exec.js'; // импорт в модуль
```

Или альтернативным способом, inline’ом и без добавления в конфиг:

```javascript
import exec from 'script-loader!./script.js';
```

#### hack

Одним из вариантов решения проблемы для некоторых плагинов является изменение в самом плагине `node_modules/plugin/dist.js` значения `this` на `window`. Такой подход сработал, например, при подключении к проекту [WOW.js](https://github.com/matthieua/WOW).


### Возможные ошибки

При возникновении ошибки с загруженностью порта рекомендуется закрыть все запущенные процессы для `node` и перезапустить сборку.


## Модификация

Ожидается добавление следующих модулей:

* [exports-loader](https://github.com/webpack-contrib/exports-loader) [javascript]
* [script-loader](https://github.com/webpack-contrib/script-loader) - используется для глобального импорта библиотек, код добавляется инлайном в тег `<script>`, доступен в глобальном контексте, но не минимизируется Webpack‘ом
* [imports-loader](https://github.com/webpack-contrib/imports-loader) - используется для добавления сторонних библиотек в глобальную область видимости

Часть материала была взята [тут](http://dev-city.me/2017/08/31/webpack-config-example) и [там](https://loftblog.ru/material/1-vvedenie-v-webpack-2/), а может еще [отсюда](https://blog.zverit.com/frontend/2017/09/15/autoprefixer-webpack-config/).

Основные модули можно найти в официальном репозитории [webpack](https://github.com/webpack/webpack).