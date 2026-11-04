require(['gitbook'],function(gitbook){
    function updateSearch(){
        var input=document.querySelector('#book-search-input input');
        if(!input)return;
        var ready=gitbook.search&&gitbook.search.isInitialized();
        input.disabled=!ready;
        input.placeholder=ready?'Введите условия поиска':'Подготовка поиска…';
    }
    gitbook.events.on('start page.change search.ready',updateSearch);
    updateSearch();
});
