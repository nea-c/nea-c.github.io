
(function () {

   var req = new XMLHttpRequest();



   //var main = document.getElementById('main_title');
   //var sub = document.getElementById('sub_title');
   //main.innerText = top_title;
   //sub.innerText = sub_title;
   function getUrlQueries() {
      var queryStr = window.location.search.slice(1);  // 文頭?を除外
      queries = {};

      // クエリがない場合は空のオブジェクトを返す
      if (!queryStr) {
         return queries;
      }

      // クエリ文字列を & で分割して処理
      queryStr.split('&').forEach(function (queryStr) {
         // = で分割してkey,valueをオブジェクトに格納
         var queryArr = queryStr.split('=');
         queries[queryArr[0]] = queryArr[1];
      });

      return queries;
   }

   var queriesA = getUrlQueries();
   console.log(typeof queriesA)
   if (queriesA != null) {
      queriesA.forEach(element => {
         eval(element)
      });
   }

   var url_path = location.pathname;
   url_path.split('/');
   url_path = url_path[0];

   var menu = document.getElementsByClassName('menu-item');
   Array.prototype.forEach.call(menu, function (element, index) {
      element.classList.remove("active");
      if (page_id == "top" && index == 0) element.classList.add("active");
      if (page_id == "news" && index == 1) element.classList.add("active");
      if (page_id == "works") {
         if (index == 2) element.classList.add("active");
         // 接続先のURLやメソッドを設定します
         req.open("GET", "./_data/works.json");

         // リクエストをサーバに送信
         req.send();

         // 読み込み時の処理を設定
         req.onreadystatechange = function () {
            // readyState=4は全てのデータを受信済み、
            // status=200は正常に処理されたことを意味します
            if (req.readyState == 4 && req.status == 200) {
               // responseTextの格納されたJSONデータをJSON.parse()で変換
               var json = JSON.parse(req.responseText);

               // 配列で処理
               var text = "";
               for (var i = 0; i < json.length; i++) {
                  text += json[i].name + "<br>";
               }
               // 結果を代入
               document.getElementById("page-works").innerHTML = text;
            }
         }
         const works_contents = JSON.parse(req.responseText);
      }
      if (page_id == "request" && index == 3) element.classList.add("active");
      if (page_id == "contact" && index == 4) element.classList.add("active");
      if (page_id == "other" && index == 5) element.classList.add("active");
   });






   function insertStr(str, index, insert) {
      return str.slice(0, index) + insert + str.slice(index, str.length);
   }



   var element = document.getElementById('page-works');
   if (element != null) {
      access_p = 'works';
      md_works(access_p, works_contents, element, true);
   }
   var element = document.getElementById('page-works-buttons');
   if (element != null) {
      access_p = 'works';
      md_button(button_c, list_page, access_p, element);
   }




   function md_works(access_p, contents, element, view_date, list_mode) {
      if (typeof contents != "undefined") {
         contents.forEach((currentValue, index, array) => {
            var date = "";
            if (contents[index] != undefined) {
               var value = contents[index];
               var youtube_video_id = value.youtube_video_id
               if (list_mode == 'name') {
                  date = value.date;
               }
               else {
                  date = value.number.slice(0, 8);
               }
               if (view_date) {
                  date = insertStr(date, 6, '.');
                  date = insertStr(date, 4, '.');
                  date = insertStr(date, 0, '◆');
               }
               else {
                  date = "";
               }
               element.insertAdjacentHTML('beforeend', '<span class="works-list"><p class="contents-date">' + date + '</p><p class="contents-title">' + value.title + '</p><p class="contents-sub-title">依頼者：' + value.client + '</p><div class="inline-center youtube box2"><iframe width="640" height="360" src="https://www.youtube.com/embed/' + youtube_video_id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></span>');
            }
         });
      }
   }

   function md_button(button_c, list_page, access_p, element) {
      if (list_page > button_c) {
         location.href = access_p;
      }
      var active_text = "";
      var link_text = "";
      var lstart = Math.max(0, list_page - 3);
      var lstart = Math.min(lstart, Math.max(0, button_c - 5));
      var def_link_text = '" href="' + access_p + '?l='
      if (button_c > 1) {
         if (list_page > 3) element.insertAdjacentHTML('beforeend', '<a class="list-page-button" href="' + access_p + '"><p class="news-title">≪</p></a>');
         if (list_page > 1) element.insertAdjacentHTML('beforeend', '<a class="list-page-button' + def_link_text + Math.max(1, list_page - 1) + '"><p class="news-title"><</p></a>');
         if (list_page > 3 && button_c > 5) element.insertAdjacentHTML('beforeend', '<a class="list-page-button-dummy"><p class="news-title">...</p></a>');
         for (var i = 1; i < 5 + 1; i++) {
            j = i + lstart;
            active_text = "";
            link_text = def_link_text;
            link_param = j;
            if (j == list_page) {
               active_text = "active";
               link_text = '"';
               link_param = "";
            }
            if (j <= button_c) element.insertAdjacentHTML('beforeend', '<a class="list-page-button ' + active_text + link_text + link_param + '"><p class="news-title">' + j + '</p></a>');
         }
         if (list_page < button_c - 2 && button_c > 5) element.insertAdjacentHTML('beforeend', '<a class="list-page-button-dummy"><p class="news-title">...</p></a>');
         if (list_page < button_c) element.insertAdjacentHTML('beforeend', '<a class="list-page-button' + link_text + Math.min(button_c, list_page + 1) + '"><p class="news-title">></p></a>');
         if (list_page < button_c - 2) element.insertAdjacentHTML('beforeend', '<a class="list-page-button' + link_text + button_c + '"><p class="news-title">≫</p></a>');
      }
   }
   function date_view(date, element) {
      date = date.slice(0, 8);
      date = insertStr(date, 6, '.');
      date = insertStr(date, 4, '.');
      element.insertAdjacentHTML('beforeend', '<p>' + date + '</p>');
   }
   function youtube_view(youtube_video_id, element) {
      element.insertAdjacentHTML('beforeend', '<iframe width="1280" height="720" src="https://www.youtube.com/embed/' + youtube_video_id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
   }
   function payment_method_view(data, element) {
      element.insertAdjacentHTML('beforeend', data);
   }
})();
