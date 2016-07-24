# PaperBits Demo

This repository shows an example how developers can use [PaperBits](https://github.com/paperbits/paperbits-knockout) library to build their own web app with a nice online content editing capability. 

You can see and play online with content editing capability on [paperbits.io](https://paperbits.io). Just follow tutorial steps (floating hints)

For your conveniences you can use and extend PaperBits library build on top of your favorite javascript framework [KnockoutJS](https://github.com/paperbits/paperbits-knockout), [AgularJS](https://github.com/paperbits/paperbits-aurelia) or [Aurelia](https://github.com/paperbits/paperbits-angular).

Please check out detailed [documentation](https://github.com/paperbits/paperbits-knockout/wiki/Documentation) page,  [getting started](https://github.com/paperbits/paperbits-knockout/wiki/Documentation#getting-started) guides and repo with [samples](https://github.com/paperbits/paperbits-samples).

## Basic functionality overview
If you have a website and need quickly extend it with web content edit functionality. You can easily add **PaperBits** library and get on your website flexible and light tools to create and edit all kinds of web content.

#### Add script and styles on your page
```html
<script src="https://cdn.paperbits.io/everything.min.js"></script>
<link href="https://cdn.paperbits.io/styles.css" rel="stylesheet" type="text/css">
```
We support several web components with online content editing capability.
You can see component borders when you hover a mouse over it. You can change a selection for an active component.
To switch to content edit mode just double click on a component and escape key for exit. 
In edit mode, you can change properties for selected component.
You can drag selected component editor and place it in any position. 
To delete an item from the page, select it and press the delete key.

![switch_edit.gif](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn-7617b.appspot.com/o/switch_edit.gif?alt=media&token=c65a651a-12e5-4628-82ba-1e70a512fb3f "switch_edit.gif")

### Text edit 
```html
<paper-textblock></paper-textblock>
```
Textblock component support standard set of text styling features.

### Picture edit 
```html
<paper-picture src="https://paperbits.io/images/pen-fight.svg" layout="noframe"></paper-picture>
```
You can add a picture element on a page by drag it from file explorer and drop it on a page. 
After the drop, you will see a notification popup to upload the picture to the media library. (Also, you can upload pictures directly to the media library)
As soon as picture file will be uploaded, it will be accessible through the media library for drag and drop on a page. 

![switch_edit.gif](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn-7617b.appspot.com/o/picture_upload.gif?alt=media&token=d29e3e4c-bbcf-4bf2-8161-e49368915c0a "picture_upload.gif")

Another approach adding a picture on a page is drag and drop picture widget from the widget library and upload a picture file through the picture editor.

![switch_edit.gif](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn-7617b.appspot.com/o/picture_upload_from_lib.gif?alt=media&token=dfcc793a-778a-4c0e-91d5-b6eb7a84beac "picture_uploadpicture_upload_from_lib.gif")

## Installation
PaperBits requires [Node.js](https://nodejs.org/) v5+ and [TypeScript](http://www.typescriptlang.org/) to run.

You need TypeScript, Bower and Gulp installed globally:
```sh
$ npm install -g typescript
$ npm install -g typings 
$ npm install -g bower 
$ npm install -g gulp
```
Clone PaperBits demo repo from GitHub
```sh
$ git clone [git-repo-url] paperbits-demo
```
Install required packages
```sh
$ cd paperbits-demo
$ npm install
$ bower install
```
Install required typings
```sh
$ cd src
$ typings install
```
# License
[GNU GPL 3](https://github.com/paperbits/paperbits-demo/blob/master/LICENSE)
