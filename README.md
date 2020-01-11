
## ВАЖНО
Я очень внимательно наблюдал за вопросами которые обсуждались в Issues. Прочитав один из них https://github.com/yndx-shri-reviewer/shri-2020-task-3/issues/3, было принято решение создать две ветки:
1. Демонстрация того, что ошибки найдены и проверка на блоки и закглавные буквы работает: **git checkout YandexLinterIsWorking.**

![скриншот интерфейса](yandlinter.png)

2. Демонстрация того, что мой линтер подключен и работает, можно посмотреть в ветке мастера: **git checkout master**.

Так-как второе задание было решением с использованием javascript, для его подключения к проекту я воспользовался инструкцией на stack-overflow:
https://stackoverflow.com/questions/53516859/how-to-import-javascript-module-in-typescript

## ПОИСК ОШИБОК - ХОД МЫСЛЕЙ

1. Первые шаги, было достаточно просто. В консоле пишет ошибку, и показывает, где она существует. Достаточно было просто гуглить, и читать документацию от Microsoft.
Например рисунок ниже:

![скриншот интерфейса](first.png)

Я нашел пример кода, где данный фрагмент был объявлен именно в таком варианте, и вставив его, ошибка исчезла. Это незнакомый мне проект и я не работал с данными инструментами, поэтому этот результат меня обрадовал.

![скриншот интерфейса](first2.png)

Также была проблема с "property.key.loc", если мне не изменяет память. Где-то я убрал "key", потому что не нашел его в интерфейсе в файле "json-to-ast.d.ts". В общем, key там был лишним, и так-как после все работает корректно, следовательно там было все верно.

2. В idex.html есть пункт {{content}}. Но он почему-то не выводил мне разметку из тестового json файла. Проблма была в регулярном выражении файла extension.ts. Через switch проверялось, если контент то возвращается html. Проверяем, чем у нас являлась переменная html. Строкой с json. Следовательно, не работает само регулярное выражение.  Пример рисунок ниже:

![скриншот интерфейса](second.png)

Я не так силен в регулярных выражениях, но я был готов дать 100 процентов, что в интернете есть выражение, которое запись проверяет между двойными кавычками. Долго искать не пришлось, все сразу заработало.


3. Вроде все выводит, но стилей нет. Почему же так? В чем проблема? Честно, очень долго искал причину. И это был большой плюс. Благодаря тому, что я перепробовал все возможное, мне не пришлось попасться на простые вещи. Где-то на середине поиска решил вставить стили прямо в файл index.html. И о боже, ничего не работает. Почему? Потому что перед "div", стоит точка. Но это же не класс. А Яндекс хитрые ребята. Если бы я это не нашел сразу, кто знает, может найдя правильное решение, ничего бы не заработало, и я бы сидел в депрессии. Но после того, как я убрал точки, все заработало. Ответ был очевиден, пути тут надо настроить как-то по-особенному.
Решение было найдено на одном из сайтов, внимательно прочитав все заработало. 
Вот ссылка, в пункте "Loading local content"
https://code.visualstudio.com/api/extension-guides/webview#loading-local-content


![скриншот интерфейса](third.png)

Ну и затем мы их возвращаем)


4. Следующей проблемой было то, что не выводило ошибки. Тут все просто (На самом деле нет, я понятия не имею сколько нужно нервов и терпения, но у меня как-то хватило). Просто ищем через console.log().  Так-как я пробежался уже практически по всем файлам, предполагалось, что проблема либо в файле linter.js, либо в server.js. Одна из ошибок была на стороне сервера, там в json передавалось что-то непонятное (вроде бы ссылка). А надо было текст. Решена проблема была методом проб и ошибок.

![скриншот интерфейса](fourth.png)

Ну и также, я очень долгое время не мог понять, почему все работает, но не выводит ошибки. Запускал логи во всех функциях и смотрел какая может не работать. Но меня очень сильно смущал метод concat, у ошибок и после того, как я поменял его на push, все заработало. Тут ход мыслей - я понятия не имею, почему все так просто, но я так долго сидел и не мог понять.

Я описываю все эти проблемы, уже после проделанной работы. Возможно я что-то упустил, но вроде по основным ошибкам, которые были найдены я прошелся. Я не использовал никаких сторонних библиотек. Я просто гуглил, и думал, а еще делал console.log. Если меня научат в яндекс школе делать это быстрее, мне еще сильнее хочется к вам попасть!!
