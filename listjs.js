(function($) {
 
$.fn.ddTableFilter = function(options) {
  options = $.extend(true, $.fn.ddTableFilter.defaultOptions, options);
 
  return this.each(function() {
    if($(this).hasClass('ddtf-processed')) {
      refreshFilters(this);
      return;
    }
    var table = $(this);
    var start = new Date();
 
	//Add drop down filters to table headers
    $('th:visible', table).each(function(index) {
      if($(this).hasClass('skip-filter')) return;
      var selectbox = $('<select class="form-control">');
      var values = [];
      var opts = [];
      selectbox.append('<option value="--all--">' + $(this).text() + '</option>');
 
      var col = $('tr:not(.skip-filter) td:nth-child(' + (index + 1) + ')', table).each(function() {
        var cellVal = options.valueCallback.apply(this);
        if(cellVal.length == 0) {
          cellVal = '--empty--';
        }
        $(this).attr('ddtf-value', cellVal);
 
        if($.inArray(cellVal, values) === -1) {
          var cellText = options.textCallback.apply(this);
          if(cellText.length == 0) {cellText = options.emptyText;}
          values.push(cellVal);
          opts.push({val:cellVal, text:cellText});
        }
      });
      if(opts.length < options.minOptions){
        return;
      }
      if(options.sortOpt) {
        opts.sort(options.sortOptCallback);
      }
	  //Get values from each row in a column into each dropdown menu
      $.each(opts, function() {
        $(selectbox).append('<option value="' + this.val + '">' + this.text + '</option>')
      });
 
      $(this).wrapInner('<div style="display:none">');
      $(this).append(selectbox);
 
      selectbox.bind('change', {column:col}, function(event) {
        var changeStart = new Date();
        var value = $(this).val();
 
        event.data.column.each(function() {
          if($(this).attr('ddtf-value') === value || value == '--all--') {
            $(this).removeClass('ddtf-filtered');
          }
          else {
            $(this).addClass('ddtf-filtered');
          }
        });
        var changeStop = new Date();
        if(options.debug) {
          console.log('Search: ' + (changeStop.getTime() - changeStart.getTime()) + 'ms');
        }
        refreshFilters(table);
 
      });
      table.addClass('ddtf-processed');
      if($.isFunction(options.afterBuild)) {
        options.afterBuild.apply(table);
      }
    });
 
    function refreshFilters(table) {
      var refreshStart = new Date();
      $('tr', table).each(function() {
        var row = $(this);
        if($('td.ddtf-filtered', row).length > 0) {
          options.transition.hide.apply(row, options.transition.options);
        }
        else {
          options.transition.show.apply(row, options.transition.options);
        }
      });
 
      if($.isFunction(options.afterFilter)) {
        options.afterFilter.apply(table);
      }
 
      if(options.debug) {
        var refreshEnd = new Date();
        console.log('Refresh: ' + (refreshEnd.getTime() - refreshStart.getTime()) + 'ms');
      }
    }
 
    if(options.debug) {
      var stop = new Date();
      console.log('Build: ' + (stop.getTime() - start.getTime()) + 'ms');
    }
  });
};
 
$.fn.ddTableFilter.defaultOptions = {
  valueCallback:function() {
    return encodeURIComponent($.trim($(this).text()));
  },
  textCallback:function() {
    return $.trim($(this).text());
  },
  sortOptCallback: function(a, b) {
    return a.text.toLowerCase() > b.text.toLowerCase();
  },
  afterFilter: null,
  afterBuild: null,
  transition: {
    hide:$.fn.hide,
    show:$.fn.show,
    options: []
  },
  emptyText:'--Empty--',
  sortOpt:true,
  debug:false,
  minOptions:2
}
 
}
)(jQuery);

function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("table_format");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Get the modal

var modalparent = document.getElementsByClassName("modal_multi");

// Get the button that opens the modal

var modal_btn_multi = document.getElementsByClassName("myBtn_multi");

// Get the <span> element that closes the modal
var span_close_multi = document.getElementsByClassName("close_multi");

// When the user clicks the button, open the modal
function setDataIndex() {

	for (i = 0; i < modal_btn_multi.length; i++){
		modal_btn_multi[i].setAttribute('data-index', i);
		modalparent[i].setAttribute('data-index', i);
		span_close_multi[i].setAttribute('data-index', i);
	}
}

for (i = 0; i < modal_btn_multi.length; i++){
	modal_btn_multi[i].onclick = function() {
		var ElementIndex = this.getAttribute('data-index');
		modalparent[ElementIndex].style.display = "block";
    };

	// When the user clicks on <span> (x), close the modal
	span_close_multi[i].onclick = function() {
		var ElementIndex = this.getAttribute('data-index');
		modalparent[ElementIndex].style.display = "none";
	};

}
window.onload = function() {

    setDataIndex();
};

window.onclick = function(event) {
    if (event.target === modalparent[event.target.getAttribute('data-index')]) {
        modalparent[event.target.getAttribute('data-index')].style.display = "none";
    }

    if (event.target === modal) {
        modal.style.display = "none";
    }
};
