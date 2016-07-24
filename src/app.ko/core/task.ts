module Vienna.Tasks {
    export function TaskToDelayedComputed<T>(taskFactory: () => Promise<T>, initialValue: T): KnockoutComputed<T> {
        var observable = ko.observable(initialValue);

        var scheduled = true; // Avoiding task invocation during dependency detection
        var result = ko.pureComputed({
            read: () => {
                if (!scheduled) {
                    taskFactory().then(observable);
                    scheduled = true;
                }
                return observable();
            }
        });
        scheduled = false;
        return result;
    }
}