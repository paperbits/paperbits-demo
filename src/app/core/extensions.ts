interface String {
    contains(value: string, caseInsensitive?: boolean): boolean;
    containsOneOf(substrings: Array<string>): boolean;
    format(...value: any[]): string;
    startsWith(value: string): boolean;
    endsWith(value: string): boolean;
    replaceAll(search: string, replacement: string): string;
    hashCode(): number
}

interface Array<T> {
    any(predicate: (item: T) => boolean): boolean;
    first(predicate?: (item: T) => boolean): T;
    where(predicate: (item: T) => boolean): Array<T>;
    remove(item: T): void;
}

String.prototype.contains = function (value: string, caseInsensitive: boolean = false): boolean {
    var originalValue: string = this;

    if (caseInsensitive) {
        originalValue = originalValue.toLowerCase();
        value = value.toLowerCase();
    }

    return originalValue.indexOf(value) !== -1;
}

String.prototype.containsOneOf = function (substrings: Array<string>): boolean {
    var value = this;
    var result = false;

    substrings.forEach(substring => {
        if (value.contains(substring))
            result = true;
    });

    return result;
}

String.prototype.format = function (...values: any[]): string {
    var formatted = this;
    for (var i = 0; i < values.length; i++) {
        var regexp = new RegExp("\\{" + i + "\\}", "gi");

        if (values[i])
            formatted = formatted.replace(regexp, values[i]);
        else
            formatted = formatted.replace(regexp, "");
    }
    return formatted;
};

String.prototype.startsWith = function (value: string): boolean {
    return this.substring(0, value.length) == value;
};

String.prototype.endsWith = function (value: string): boolean {
    return this.lastIndexOf(value) == this.length - value.length;
};

String.prototype.hashCode = function(): number {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

String.prototype.replaceAll = function (search: string, replacement: string): string {
    return this.split(search).join(replacement);
};

Array.prototype.any = function <T>(predicate: (item: T) => boolean): boolean {
    var result = false;

    $.each(this, function () {
        if (predicate(this)) {
            result = true;
        }
    });
    return result;
};

Array.prototype.first = function <T>(predicate: (item: T) => boolean): T {
    var result = null;

    if (!predicate)
        predicate = () => true;

    for (var i = 0; i < this.length; i++) {
        if (predicate(this[i])) {
            result = this[i];
            break;
        }
    };
    return result;
};

Array.prototype.where = function <T>(predicate: (item: T) => boolean): Array<T> {
    var result = new Array();

    $.each(this, function () {
        if (predicate(this))
            result.push(this);
    });
    return result;
};

Array.prototype.remove = function <T>(item: T): void {
    var index = this.indexOf(item);
    this.splice(index, 1);
};