
/*
 * Author: Adam Randlett
 * adam@randlett.net
*/

TMF.select = (function ($, sel, window, document, undefined) {

  sel._body = $('body');

  sel.selectWidget = function () {
    
    var selectElements = $('.select');
    
    if(selectElements[0]){
      
      sel._body.on('change','select', function () {
        
        var $this = $(this),
            span = $this.next();
            label = $this.find("option:selected").text(),
            value = $this.find("option:selected").val(),
            action = $this.parent().data('action');


        if(action === 'byspeaker'){
          sel.filterInit(value,label,'speaker');
        }

        if(action === 'byauthor'){
          sel.filterInit(value,label,'author');
        }

        if(action === 'bymonth'){
          sel.filterInit(value,label,'bymonth');
        }

        if(action === 'bytopic'){
          sel.filterInit(value,label,'topic');
        }

        if(action === 'bymedia'){
          sel.filterInit(value,label,'media');
        }

        if(action === 'byseason'){
          sel.filterInit(value,label,'season');
        }

        if(action === 'download'){
          $this.parent().parent().find('[name=id]').attr('value',value);
          $this.parent().parent().submit();
          //window.location.href = value;
        }

        if(action === 'link'){
          window.location.href = value;
          //window.open(value,label,'_blank','width=850,height=700');
        }

      });
      
    }
  };

  sel.selectWidget();
  return sel;

}($, TMF || {}, this, this.document));


