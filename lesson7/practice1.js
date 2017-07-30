$('h1');
$('#site_title');
$('article li');
$('article li').eq(2);
$('table').find('tr').filter(':odd');
// or
$('table').find('tr:odd');
$('article li li').filter(":contains('ac ante')").parents('li');
$('article li li').filter(":contains('ac ante')").next();
$('table td').last();
// or
$('table td').eq(-1);
$('td').not(".protected");
// or
$('td:not(".protected")');
$('a[href^=#]');
$('[class*=block]');
