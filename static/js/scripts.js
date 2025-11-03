let content_dir = 'contents/'
const config_file = 'config.yml'
// const section_names = ['home', 'hobbies','awards','publications']
const section_names = ['home', 'hobbies','awards']

function getLanguage() {
    const params = new URLSearchParams(window.location.search);
    let lang = params.get('lang');
    if (!lang) {
        lang = localStorage.getItem('lang') || 'en';
    }
    // normalize
    lang = (lang === 'zh' || lang === 'en') ? lang : 'en';
    return lang;
}

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    const url = new URL(window.location.href);
    if (lang === 'en') {
        url.searchParams.delete('lang');
    } else {
        url.searchParams.set('lang', lang);
    }
    window.location.href = url.toString();
}

window.toggleLanguage = function () {
    const current = getLanguage();
    setLanguage(current === 'zh' ? 'en' : 'zh');
}


window.addEventListener('DOMContentLoaded', event => {

    // Determine language and content directory
    const lang = getLanguage();
    document.documentElement.lang = lang;
    content_dir = (lang === 'zh') ? 'contents/zh/' : 'contents/';

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Update language toggle button label
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.textContent = (lang === 'zh') ? 'English' : '中文';
    }

    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

}); 
