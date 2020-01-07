window.onload = () => {
    // Accordeon
    let body = document.getElementsByTagName('BODY')[0];

    body.onclick = (e) => {
        target = e.target;

        while(target) {
            if(target.classList.contains('history__transaction')){
                target.querySelector('.history__hide').classList.toggle('e-accordion__more')
            }
            target = target.parentElement;
        }
        
    };


    // Theme changing
    let button = document.querySelector('.onoffswitch');

    button.onclick = (e) => {
        if(button.classList.contains('onoffswitch_checked')) {
            button.classList.remove('onoffswitch_checked');
            changeTheme();
        
        } else {
            button.classList.add('onoffswitch_checked');
            changeTheme();
        
        }
    }

    let changeTheme = () => {
        let theme_inverse = document.querySelectorAll('.theme_color_project-inverse'); 
        let theme_default = document.querySelectorAll('.theme_color_project-default'); 
        for(let i = 0; i < theme_inverse.length; i++) {
            theme_inverse[i].classList.remove('theme_color_project-inverse')
            theme_inverse[i].classList.add('theme_color_project-default');
        }
        for(let i = 0; i < theme_default.length; i++) {
            theme_default[i].classList.remove('theme_color_project-default')
            theme_default[i].classList.add('theme_color_project-inverse');
        }
    }

}
