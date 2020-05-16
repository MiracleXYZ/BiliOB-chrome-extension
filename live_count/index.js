class BiliOB_LiveCount {
  log(...logs) {
    console.log(
      `%c BiliOB `,
      "background: #1e88e5; color: #e8e8e8; border-radius: 3px;",
      ...logs
    );
  }

  constructor () {
    this.pageSelected = false;
    this.streamer = false;
    this.fullscreen = false;

    if (window.location.href.split('?')[1] === "live_count") this.pageWaiter();

    let menuChecker = setInterval(() => {
      let menu = document.querySelector('div.n-tab-links');
      if (typeof menu === 'undefined' || menu === null) return;

      clearInterval(menuChecker);
      this.createMenu(menu);
    }, 250);


  }

  createElement(element, attribute, inner) {
    if (typeof element === "undefined") return false;
    if (typeof inner === "undefined") inner = "";

    const el = document.createElement(element);
    if (typeof attribute === 'object') {
      for (var key in attribute) el.setAttribute(key, attribute[key]);
    }

    if (!Array.isArray(inner)) inner = [inner];

    for (var k = 0; k < inner.length; k++) {
      el.appendChild(inner[k].tagName ? einner[k] : document.createTextNode(inner[k]));
    }
    return el;
  }

  createMenu(menu) {
    console.log('createMenu');
    const menuButton = () => {
      let a = this.createElement("a", {
        "class": "n-btn n-livecount",
        "id": "biliob-live_count"
      });
      let b = this.createElement("span", {
        "class": "n-text"
      });
      b.innerText = "粉丝实时计数";
      a.appendChild(b);
      return a;
    };
    const button = menuButton();
    menu.appendChild(button);
    
    if (this.pageSelected) this.buttonActive(menu, button);
    button.onclick = () => this.pageSelected ? window.location.href = window.location.href + "?live_count" : this.pageWaiter() + this.buttonActive(menu, button);
  }

  buttonActive(menu, button) {
    for (let item of menu.children) {
      if (item.localName !== 'a') continue;

      item.onclock = () => window.location.replace(item.getAttribute('href'));
    }

    button.classList.add("router-link-exact-active", "router-link-active", "active");
  }

  pageWaiter() {
    this.pageSelected = true;
    let checker = setInterval(async () => {
      let outerPage = document.querySelector("#app > div.s-space");
      if (typeof outerPage === 'undefined' || outerPage === null) return;
      outerPage.innerHTML = `Loading...`;
      document.querySelector('#app > div.to-top').remove();

      clearInterval(checker);

      let chartImport = document.createElement("script");
      chartImport.type = "text/javascript";
      chartImport.src = `${biliob_settings.files}live_count/highcharts.js`;

      chartImport.onload = () => {
        let countImport = document.createElement("script");
        countImport.type = "text/javascript";
        countImport.src = `${biliob_settings.files}live_count/odometer.js`;

        countImport.onload = () => {
          this.createPage(outerPage);
        };
        document.head.appendChild(countImport);
      };

      document.head.appendChild(chartImport);
    }, 250);
  }

  async createPage(outerPage) {
    console.log('createPage');
    document.title = `粉丝实时计数`;
    outerPage.innerHTML = "";

    let a = this.createElement("div", {});
    let b = this.createElement("div", {"class": "wrapper"});
    let page = this.createElement("div", {"class": "col-full"});
    b.appendChild(page);
    a.appendChild(b);
    
    outerPage.appendChild(a);

    let css = await fetch(`${biliob_settings.files}live_count/index.css`).then((response) => response.text());
    let template = await fetch(`${biliob_settings.files}live_count/index.html`).then((response) => response.text());

    template = template.replace("{{css}}", css);
    page.innerHTML += template;
    page.querySelector(".BO_header a").setAttribute("href", `https://www.biliob.com/author/${mid}`);

    this.chart = Highcharts.chart("BO_chart", {
      chart: {
        type: 'spline',
        zoomType: 'x',
        animation: Highcharts.svg, marginRight: 10,
        backgroundColor: 'transparent',
        spacingLeft: 0,
        spacingRight: 0,
        events: { load: function () { } }
      },
      plotOptions: { series: {
        lineWidth: 3, marker: { enabled: false } }
      },
      title: { text: '' },
      xAxis: { title: { text: '' }, type: 'datetime', tickPixelInterval: 150 },
      yAxis: { title: { text: '' },
        labels: {  enabled: false },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }], allowDecimals: false
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' + this.y.toLocaleString();
        }
      },
      legend: { enabled: false },
      exporting: { enabled: false },
      series: [{ name: "粉丝数", color: '#1e88e5', data: (function () { }()) }]
    });

    this.counter = new Odometer({
      el: document.getElementById("subCount"),
      format: '(,ddd)',
      theme: 'default'
    });
  
    document.querySelector(".BO_header #enableStreamerMode").onclick = this.toggleStreamerMode.bind(this);
    document.querySelector(".BO_header #fullscreenMode").onclick = this.toggleFullscreen.bind(this);
    document.onkeyup = function(e) {
      if (e.keyCode !== 27) return;
      if (this.fullscreen) this.toggleFullscreen();
      if (this.streamer) this.toggleStreamerMode();
    }.bind(this);

    setInterval(() => this.getSubscribers(), 3000);
  }

  toggleStreamerMode() {
    this.streamer = !this.streamer;
    document.querySelector('#app > div.s-space > div > div > div').style.background = this.streamer ? "rgb(0,255,0)" : "#fff";

    document.querySelector("#internationalHeader").style.display = this.streamer ? "none": "block";
    document.querySelector("#app > div.h").style.display = this.streamer ? "none": "block";
    document.querySelector("#navigator").style.display = this.streamer ? "none": "block";
    document.querySelector("#navigator-fixed").style.display = this.streamer ? "none": "block";

    document.querySelector(".BO_header").style.display = this.streamer ? "none" : "flex";
    document.querySelector(".BO_notice").style.display = this.streamer ? "flex" : "none";
    setTimeout(() => document.querySelector(".BO_notice").style.display = "none", 2000);
    document.querySelector("#BO_chart").style.display = this.streamer ? "none" : "block";
    document.querySelector(".BO_logo").classList[this.streamer ? "add" : "remove"]("streamer");
  }
  toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
    document.querySelector(".BO_live_count").style.background = "var(--ytcp-background-10)";

    document.querySelector("#internationalHeader").style.display = this.fullscreen ? "none": "block";
    document.querySelector("#app > div.h").style.display = this.fullscreen ? "none": "block";
    document.querySelector("#navigator").style.display = this.fullscreen ? "none": "block";
    document.querySelector("#navigator-fixed").style.display = this.fullscreen ? "none": "block";

    document.querySelector(".BO_header").style.display = this.fullscreen ? "none" : "flex";
    document.querySelector(".BO_notice").style.display = this.fullscreen ? "flex" : "none";
    setTimeout(() => document.querySelector(".BO_notice").style.display = "none", 2000);
    document.querySelector("#BO_chart").style.display = this.fullscreen ? "block" : "block";
    document.body.style.zoom = this.fullscreen ? "110%" : "100%";
  }

  async getSubscribers() {
    try {
      let subscribers = await fetch(`https://api.bilibili.com/x/relation/stat?vmid=${mid}`).then((response) => {
        return response.json()
      }).then((data) => {
        return data.data.follower
      });
      if (subscribers === 0) throw new Error(`Bilibili API returned no subscribers`);

      this.chart.series[0].addPoint([this.getTime(), subscribers], true, false);
      this.subCount = subscribers;
      this.counter.update(subscribers);

    } catch (e) {this.log(e);}
  }

  getTime() {
    var now = new Date();
    var time = now.getTime();
    var localOffset = (-1) * now.getTimezoneOffset() * 60000;
    var x = new Date(time + localOffset).getTime();
    return x;
  }

}

new BiliOB_LiveCount();

