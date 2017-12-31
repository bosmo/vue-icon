const fs = require('fs')
const xml2js = require('xml2js')

const tag =  (new Date()).getTime();

const head = `@font-face {
  font-family: ui-icons;
  /*work in ie9, webpack to data-url*/ 
  src:url('fonts/icons.woff?t=${tag}') format('woff'); 
}
[class*=" ui-icon-"], [class^="ui-icon-"] {
  font-family: "ui-icons" !important;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  speak: none;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.mp-icon-loading{
  animation: rotating 1.4s linear infinite;
}
@keyframes rotating{
  0% {
      transform: rotate(0);
  }
  100% {
      transform: rotate(1turn);
  }
}
`

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>IconFont</title>
<link rel="stylesheet" href="demo.css">
<style>
.icons{
    margin: 20px auto;
    padding: 0;
    list-style:none;
    font-size: 12px;
    width:800px;
    overflow: hidden;
}
.icons li {
text-align: center;
    float: left;
    overflow: hidden;
    width: 100px;
    height: 100px;
}
.icons li i {
font-size: 24px;
}
.icons li div{
line-height:20px;
}
</style>
</head>
<body>
<ul class="icons">#icons#</ul>
</body>
</html>`

const parser = new xml2js.Parser()
fs.readFile(__dirname + '/fonts/icons.svg', (err, data) => {
  parser.parseString(data, (err, result) => {
    let s = head
    let lis = []

    result.svg.defs[0].font[0].glyph.forEach((d) => {
      const c = d.$
      const name = c['glyph-name']
      if (name === 'x') {
        return true
      }
      const code = c.unicode.charCodeAt(0).toString(16)

      const x = `.ui-icon-${name}:before { content: "\\${code}"; }\n`
      s += x

      lis.push(`<li>
    <i class="ui-icon-${name}"></i>
    <div class="name">${name}</div>
    <div class="code">${code}</div>
</li>`)
    })
    fs.writeFileSync(__dirname + '/icons.less', s)
    fs.writeFileSync(__dirname + '/demo.css', s)
    fs.writeFileSync(__dirname + '/demo.html', html.replace('#icons#', lis.join('\n')))
    console.log(s)
  })
})