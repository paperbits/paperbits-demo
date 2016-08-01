# PaperBits Demo

This repository shows an example of how using PaperBits you can enable advanced content authoring tools in your web apps.

Please explore the [DEMO](https://paperbits.io), check out the [documentation](https://github.com/paperbits/paperbits-knockout/wiki) and [samples repository](https://github.com/paperbits/paperbits-samples).

- [Overview](#text-block)
    - [Text block widget](#text-block)
    - [Picture widget](#picture)
    - [Layout widget](#layout)
    - [Drop bucket](#drop-bucket)
    - [Pages manager](#pages-manager)
    - [Navigation editor](#navigation-editor)
    - [Media library](#media-library)
    - [Widgets library](#widgets-library)
- [Setting up dev environment](#setting-up-dev-environment)
- [License](#license)


## Basic functionality overview


PaperBits is all about widgets and editors, where **widgets** are reusable blocks that make up the page content and **editors** are tools that help you manage what and how widgets should display.

A widget is switched to **editing mode** by double clicking/tapping on it. This brings up an editor where widget's properties, appearance, etc., can be changed as needed. All the changes are immediately reflcted in the content.


### Text block widget
A text block is the simplest and most used element on a page. 
```html
<paper-textblock>
    Lorem ipsum dolor sit amet, nibh nec vitae ut magnis...
</paper-textblock>
```
Its editor supports common set of text stylings like alignment, font weight, ordered/unordered list, etc., and, as the project moves on, its functionality gets extended with other useful tools like real-time collaboration, text-proofing, leaving comments, etc.
  
![switch_edit.gif](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn.appspot.com/o/switch-edit.gif?alt=media&token=4e43d530-4dbb-492f-8876-f80d3ba0818d "switch_edit.gif")

### Picture widget
The second most used widget is a picture.
```html
<paper-picture src="https://paperbits.io/images/pen-fight.svg" layout="noframe"></paper-picture>
```
The easiest way to add one to the content is to drop an image file on a page or copy-paste it from the clipboard. New files appear as a thumbnail in a small window called **drop bucket** (described below). From there you can either drag it directly to the content (or click "upload" button to place it into media library for later use). 

![Adding picture through dropbucket](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn.appspot.com/o/picture-upload.gif?alt=media&token=15baf6c8-7bb5-44ef-b946-16125d841b2d "picture_upload.gif")

### Layout widget
The layout is a widget that manages content in a responsive grid. The cells of the grid are also widgets that make up its rows and columns. They can be rearranged withing the grid using the same drag-and-drop approach.
```html
<paper-layout>...</paper-layout>
```

### Drop bucket
The drop bucket appears when external content, like file or link, is dropped or copy-pasted into the page. If the content is recognized, the drop bucket may use it to create corresponding widget, show its thumbnail and/or suggest to upload it as a media.

![Dropbucket](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn.appspot.com/o/dropbucket-youtube.gif?alt=media&token=cb24c479-8a42-4dbf-b585-3706735039e2) 

### Pages manager
Pages manager allows to create and delete pages as well as navigate through them.

### Navigation editor
Navigation workshop helps managing complex hierarchical menus using a keyboard and drag-and-drop interface.

### Media library
Media library helps managing uploaded files.

### Widgets library
Widgets workshop introduces a set of widgets and snippets that you can put into the content.

![Adding picture through widgets library](https://firebasestorage.googleapis.com/v0/b/paperbits-cdn.appspot.com/o/picture_uploadpicture_upload_from_lib.gif?alt=media&token=cc9a6487-5db8-4e5a-9fc9-9d01bf567f9f "picture_uploadpicture_upload_from_lib.gif")


## Setting up dev environment
PaperBits requires [Node.js](https://nodejs.org/) v5+ and [TypeScript](http://www.typescriptlang.org/) to run. Also you will need TypeScript, Bower and Gulp installed globally:
```sh
$ npm install -g typescript
$ npm install -g bower 
$ npm install -g gulp
```
Clone paperbits-demo repository from GitHub
```sh
$ git clone https://github.com/paperbits/paperbits-demo.git
```
Install required packages
```sh
$ npm install
$ bower install
```
Launch demo website
```sh
$ gulp serve
```
# License
[GNU GPL 3](https://github.com/paperbits/paperbits-demo/blob/master/LICENSE)
