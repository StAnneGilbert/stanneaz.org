
/*
 * Author: Adam Randlett
 * adam@randlett.net
 * @requires https://github.com/Mikhus/jsurl
*/

TMF.filter = ( function ($, ftr, window, document, undefined) {

  "use strict";
  

  ftr.filterInit = function ( value, title, route ){
      var url = new Url,
          data = { url: url, val: value, title: title };
          url.query.clear();

    if(value == ""){
      ftr.updateUrl( url );
    }else{

      if (route === 'bymonth') {

        ftr.updateUrl( ftr.getQuery(data,"month") );

      } else if (route === 'topic' || route === 'category') {

        ftr.updateUrl( ftr.getQuery(data,"category") );

      } else if (route === 'speaker' || route === 'author') {

        ftr.updateUrl(  ftr.getQuery(data, "speaker") );

      } else if (route === 'bible') {

        ftr.updateUrl(  ftr.getQuery(data, "bible") );

      } else if (route === 'season') {

        ftr.updateUrl(  ftr.getQuery(data,"season") );
        
      }
    }
    
  };

  ftr.getQuery = function ( data, method ){
    var url = data.url;
    url.query.q = method + ":" + data.val;
    url.query.t = data.title; 
    return url;
  };

  ftr.updateUrl = function ( url ){
    window.location = url.toString();
  };

  return ftr;

}($, TMF || {}, this, this.document));


