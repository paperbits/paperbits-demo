/**
 * Created by mtuchkov on 7/8/2016.
 */
module Vienna.Widgets.Domain.Engagement {
    export class Analytics {
        constructor(private document: Document) {
            var body = document.querySelector('body');
            body.addEventListener('click', Analytics.traceData, true);
        }

        private static traceData(event): void {
            var element = event.target;
            if (element.tagName.toLowerCase() == 'span' && element.parentElement.tagName.toLowerCase() == 'a'){
                element = element.parentElement;
            }
            if (element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'button') {

                var isVienna = element.className.indexOf('vienna-toolbox-button') > -1 ||
                    element.className.indexOf('vienna-button') > -1;

                var label = element.innerText;

                var category = Analytics.findCategory(element);

                var link = element.href;

                dataLayer.push({
                    'event': 'ButtonClick',
                    'category': (isVienna ? 'Vienna' : 'Content')+ "." + category,
                    'label': label,
                    'action': link,
                });
            }
        }

        private static findCategory(element): string {
            var result = '';
            while(element.tagName.toLowerCase() != 'body'){
                switch (element.tagName.toLowerCase()){
                    case 'workshops':
                        return 'workshops';
                    case 'nav':
                        return 'navigation';
                    case 'paper-page':
                        return 'content';
                    case 'dropbucket':
                        return 'dropbucket';
                    case 'footer':
                        return 'footer';
                }
                element = element.parentElement;
            }
            return result;
        }
    }
}