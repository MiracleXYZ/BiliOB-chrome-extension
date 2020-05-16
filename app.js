'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var console = (function (Cons) {
    return {
        log: function (text) {
            Cons.log(text);
        },
        info: function (text) {
            Cons.info(text);
        },
        warn: function (text) {
            Cons.warn(text);
        },
        error: function (text) {
            Cons.error(text);
        }
    };
  }(window.console));
  (function () {
    if (window.location.host === 'www.bilibili.com') {
      var biliob = {};

      biliob.video = {
        initialize: (mid) => {
          if (document.getElementById("biliob") != null) {
            document.getElementById("biliob").remove();
          }
          console.log(mid);
          biliob.video.header();
          biliob.video.stats(mid);
        },
        header: () => {
          var content = document.createElement('div');
          content.id = 'biliob';
          content.style = "margin-bottom: 10px; background: var(--yt-dialog-background);";
          content.innerHTML = `
          <div style="width:100%; background-color: rgb(244, 244, 244); max-height: 63px; overflow: hidden;" id="bo-heading">
              <a href="https://www.biliob.com/" target="_blank"><img style="padding-left: 3px; width: 200px;" src="${chrome.extension.getURL('img/header.png')}" /></a>
              <img id="bo-return" style="margin: 15px 10px; float: right; display:none;" src="${chrome.extension.getURL('img/arrow.png')}" />
          </div>`;
          if (document.getElementById('danmukuBox') != null) {
            document.getElementById('danmukuBox').parentNode.insertBefore(content, document.getElementById('danmukuBox'));
          };

          //
          var content = document.createElement('div');
          content.innerHTML = `
          <style>
              .bo-hide {
                max-height: 0 !important;
              }
              #bo-data-pages {
                overflow: hidden;
                max-height: 2000px;

                transition-property: all;
                transition-duration: 500ms;
                transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
              }
            </style>
            <div id="bo-data-pages">
              <div style="width: 100%; display: table;">
                <div style="display:table-row; text-align: center; cursor: pointer" id="SBMenu">
                  <style>.bo-active { background-color: #1e88e5 !important; }</style>
                  <div style="display:table-cell; width: 80%; padding: 5px 0; border-right: 1px solid #1e88e5; background-color: #1e88e5;" id="CHANOVER" class="bo-active" onmouseover="this.style.backgroundColor = '#1e88e5'" onmouseout="this.style.backgroundColor = '#1e88e5'">
                    <h3 style="margin: 0; padding: 10px 0; color: #fff; font-size: 1em;">概览</h3>
                  </div>
                  <div style="display:table-cell; width: 10%; padding: 5px 0; border-right: 1px solid #1e88e5; background-color: #1e88e5;" id="ACCOUNTOVER" onmouseover="this.style.backgroundColor = '#1e88e5'" onmouseout="this.style.backgroundColor = '#1e88e5'">
                    <!-- <h3 style="margin: 0; padding: 10px 0; color: #fff; text-transform: uppercase; font-size: 1em;">设置</h3> -->
                  </div>
                  <div style="display:table-cell; width: 10%; padding: 5px 0; background-color: #1e88e5;" id="bo-hide" onmouseover="this.style.backgroundColor = '#1e88e5'" onmouseout="this.style.backgroundColor = '#1e88e5'">
                    <h3 style="margin: 0; padding: 10px 0; color: #fff; text-transform: uppercase; font-size: 1em;">收起</h3>
                  </div>
                </div>
              </div>
              <div id="ChanOver" style="width:100%; background-color: var(--yt-dialog-background); display: block;"> </div>
              <div id="AccountOver" style="width:100%; background-color: var(--yt-dialog-background); display: none;"> </div>
            </div>`;
          document.getElementById("biliob").appendChild(content);

          document.getElementById("CHANOVER").onclick = () => {
            document.getElementById("ChanOver").style.display = "block";
            document.getElementById("AccountOver").style.display = "none";
            document.getElementById("CHANOVER").classList.add("bo-active");
            document.getElementById("ACCOUNTOVER").classList.remove("bo-active");
          }

          document.getElementById("bo-hide").onclick = () => {
            document.getElementById("bo-data-pages").classList.add("bo-hide");
            document.getElementById("bo-return").style.display = `block`;
          };

          document.getElementById("bo-return").onclick = () => {
            document.getElementById("bo-data-pages").classList.remove("bo-hide");
            document.getElementById("bo-return").style.display = `none`;
          };

          if (document.getElementById("biliob").offsetHeight >= 60) document.getElementById("biliob").classList.add("largetube");


        },
        login: () => {},
        stats: (mid) => {
          chrome.runtime.sendMessage({
            contentScriptQuery: "queryInfo",
            itemId: mid
          }, data => {
            console.log(data);
            fetch(chrome.extension.getURL('stats.html')).then((response) => {
              return response.text();
            }).then((text) => {
              if (document.getElementById('biliob-stats')) {
                document.getElementById('biliob-stats').remove();
              }

              var content = document.createElement('div');
              content.id = 'biliob-stats';
              content.innerHTML = text;
              document.getElementById("ChanOver").appendChild(content);

              document.getElementById("BOL").href = `https://www.biliob.com/author/${mid}`;
              document.getElementById("BOLC").href = `https://space.bilibili.com/${mid}`;

              // 排名
              document.getElementById("SR").innerHTML = data.rank.fansRank || "--";
              document.getElementById("VR").innerHTML = data.rank.archiveViewRank || "--";
              document.getElementById("GR").innerHTML = data.rank.likeRank || "--";

              // 决定涨跌幅
              // #b3382c #41a200
              var formattedChange = function(change) {
                if (change > 0) {
                  return [`▲${change}`, '#b3382c']
                } else if (change < 0) {
                  return [`▼${-change}`, '#41a200']
                } else {
                  return ['▲0', '#000000']
                }
              };
              var formattedPctChange = function(change) {
                if (change > 0) {
                  return [`▲${change}%`, '#b3382c']
                } else if (change < 0) {
                  return [`▼${-change}%`, '#41a200']
                } else {
                  return ['▲0%', '#000000']
                }
              };

              // 名次的变化好像没有啥意义，所以这里只显示颜色吧
              var textcolor = formattedChange(-data.rank.dFansRank || "--");
              // document.getElementById("SRD").innerHTML = textcolor[0];
              // document.getElementById("SRD").style.color = textcolor[1];
              document.getElementById("SR").style.color = textcolor[1];
              var textcolor = formattedChange(-data.rank.dArchiveViewRank || "--");
              // document.getElementById("VRD").innerHTML = textcolor[0];
              // document.getElementById("VRD").style.color = textcolor[1];
              document.getElementById("VR").style.color = textcolor[1];
              var textcolor = formattedChange(-data.rank.dLikeRank || "--");
              // document.getElementById("GRD").innerHTML = textcolor[0];
              // document.getElementById("GRD").style.color = textcolor[1];
              document.getElementById("GR").style.color = textcolor[1];

              // 计算：未登录只会显示30天的数据
              // TODO: 加入BiliOB登录系统
              var dataArray = data.data;
              if (dataArray.length >= 31) {
                var subs30d = dataArray[0].fans - dataArray[30].fans;
                var subs30dpct = Math.round(((dataArray[0].fans - dataArray[15].fans) / (dataArray[15].fans - dataArray[30].fans) - 1) * 100); // 只有30天数据所以用15天做workaround
                var subs30davg = Math.round(subs30d / 30);
                
                var view30d = dataArray[0].archiveView - dataArray[30].archiveView;
                var view30dpct = Math.round(((dataArray[0].archiveView - dataArray[15].archiveView) / (dataArray[15].archiveView - dataArray[30].archiveView) - 1) * 100);
                var view30davg = Math.round(view30d / 30);
  
                var like30d = dataArray[0].like - dataArray[30].like;
                var like30dpct = Math.round(((dataArray[0].like - dataArray[15].like) / (dataArray[15].like - dataArray[30].like) - 1) * 100);
                var like30davg = Math.round(like30d / 30);
              } else {
                var subs30d = dataArray[0].fans - dataArray[dataArray.length - 1].fans;
                var subs30dpct = 0;
                var subs30davg = Math.round(subs30d / (dataArray.length - 1));

                var view30d = dataArray[0].archiveView - dataArray[dataArray.length - 1].archiveView;
                var view30dpct = 0;
                var view30davg = Math.round(view30d / (dataArray.length - 1));

                var like30d = dataArray[0].like - dataArray[dataArray.length - 1].like;
                var like30dpct = 0;
                var like30davg = Math.round(like30d / (dataArray.length - 1));
              }

              if (dataArray.length >= 2) {
                var subsd = dataArray[0].fans - dataArray[1].fans;
                var viewd = dataArray[0].archiveView - dataArray[1].archiveView;
                var liked = dataArray[0].like - dataArray[1].like;
              } else {
                var subsd = 0;
                var viewd = 0;
                var liked = 0;
              }
              
              // 数据注入页面元素
              document.getElementById("SL30D").innerHTML = subs30d || "--";
              document.getElementById("VL30D").innerHTML = view30d || "--";
              document.getElementById("GL30D").innerHTML = like30d || "--";

              var textcolor = formattedPctChange(subs30dpct || "--");
              document.getElementById("SL30P").innerHTML = textcolor[0];
              document.getElementById("SL30P").style.color = textcolor[1];
              var textcolor = formattedPctChange(view30dpct || "--");
              document.getElementById("VL30P").innerHTML = textcolor[0];
              document.getElementById("VL30P").style.color = textcolor[1];
              var textcolor = formattedPctChange(like30dpct || "--");
              document.getElementById("GL30P").innerHTML = textcolor[0];
              document.getElementById("GL30P").style.color = textcolor[1];

              document.getElementById("DSA").innerHTML = subs30davg || "--";
              document.getElementById("DVA").innerHTML = view30davg || "--";
              document.getElementById("DGA").innerHTML = like30davg || "--";

              document.getElementById("ST").innerHTML = subsd || "--";
              document.getElementById("VT").innerHTML = viewd || "--";
              document.getElementById("GT").innerHTML = liked || "--";



            });
          });

        }
      };
      
      biliob.execute = () => {
        var injectTables = function () {
          if (window.location.pathname.startsWith('/video/')) {
            var links = document.getElementsByClassName('username');
            var links2 = document.getElementsByClassName('info-name');
            if (links.length != 0) {
              var link = links[0];
              var mid = link.getAttribute('href').replace('//space.bilibili.com/', '');
            } else if (links2.length != 0) {
              var link = links2[0];
              var mid = link.getAttribute('href').replace('//space.bilibili.com/', '');
            } else {return; }
            biliob.video.initialize(mid);
          }
        };

        chrome.storage.sync.get({manual: false}, (options) => {
          if (options.manual) {
            document.getElementById('danmukuBox').addEventListener("click", (e) => {
              injectTables();
            })
          } else {
            window.addEventListener("message", (e) => {
              if (e.data) {
                injectTables();
              }
            });
          }
        })
      }
      biliob.execute();

    }
  })();
})