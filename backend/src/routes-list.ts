export function renderRoutesList(list: string[]) {
  let routeListHtml = '';
  for (const route of list) {
    let splitroute = route.split(' ');
    routeListHtml += `<li>${splitroute[0]} <a> ${splitroute[1]}</a></li>`;
  }
  let html = `
  <html>
  <head>
    <title>Routes list</title>
  </head>
  <body>
    <h1>List all active routes</h1>
  
    <ul>
      ${routeListHtml}
    </ul>

  </body>
  </html>
  `

  return html;
}
