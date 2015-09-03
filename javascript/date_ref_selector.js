$(document).ready(function() {

  var base_period;
  var return_start;
  var return_end;
  //http://jsfiddle.net/bseth99/dJDHd/
  $('#ref_list.dropdown-menu li > a').click(function(e){
    $('.selection').text(this.innerHTML);
    base_period = $(this).text();
  });

  // background map stamen
  $('#stamenvisibility').change(function(){
    if($(this).is(':checked')){
      stamen.setVisible(true);
    } else {
      stamen.setVisible(false);
    }
  });

  // background map osm
  $('#osmvisibility').change(function(){
    if($(this).is(':checked')){
      osm.setVisible(true);
    } else {
      osm.setVisible(false);
    }
  });

  // background waterways
  $('#waterwaysvisibility').change(function(){
    if($(this).is(':checked')){
      waterways.setVisible(true);
    } else {
      waterways.setVisible(false);
    }
  });

  // gauge waterways
  $('#gaugesvisibility').change(function(){
    if($(this).is(':checked')){
      gauges.setVisible(true);
    } else {
      gauges.setVisible(false);
    }
  });


  // the bootstrap jquery date-range picker
  //http://www.daterangepicker.com/
  //define init start and end dates and provide variables required for th python script

  var start_default=new Date();
  start_default.setDate(start_default.getDate()-14);

  return_start = $.datepicker.formatDate('yy-mm-dd', start_default);

  var end_default=new Date();
  end_default.setDate(end_default.getDate()-1);

  return_end = $.datepicker.formatDate('yy-mm-dd', end_default);

  $('#daterange').daterangepicker({
    locale: {
      separator: ' to ',
      format: 'DD-MM-YY'
    },
    startDate: start_default,
    endDate: end_default, 
    maxDate: end_default
  }, 
  // callback funtion, variables are set on change of the datapicker
  function(start, end){
    return_start=start.format('YYYY-MM-DD');
    return_end=end.format('YYYY-MM-DD');
  });

  
  $('#submit').click(function() {

    console.log(return_start);
    console.log(return_end);

    output=[];

    // get the values of the return periods
    var rp = [];
    $.each($("input[name='rp']:checked"), function(){            
      rp.push($(this).val());
    });

    var rp_array=JSON.stringify(rp);

    // -----------------------------------------------------------------------
    // dynamic styling from 
    // https://openlayersbook.github.io/ch06-styling-vector-layers/example-07.html

    // a default style is good practice!
    var defaultStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#99B3CC',
            width: 1
        })
    });

    // the style function returns an array of styles
    // for the given feature and resolution.
    // Return null to hide the feature.
    function styleFunction(feature, resolution) {

        // a javascript object literal can be used to cache
        // previously created styles. Its very important for
        // performance to cache styles.
        var styleCache = {};
        var rp_colors = {};

        var rp_length = rp.length;


        var rp_class=1;

        for(i=0; i<rp_length; i++){
            // the colors are inverted .. 
            var color_index = rp_length-(i+1);

            rp_colors[rp_class] = colorbrewer.PuRd[rp_length][color_index]

            // increment by one
            rp_class=rp_class+1;
        };

        // get the rp_class from the feature properties
        var level = feature.get('rp_class');
        // if there is no level or its one we don't recognize,
        // return the default style (in an array!)
        if (!level || !rp_colors[level]) {
            return [defaultStyle];
        }
        // check the cache and create a new style for the income
        // level if its not been created before.
        if (!styleCache[level]) {
            styleCache[level] = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: rp_colors[level], 
                    width: 2
                }),
            });
        }
        // at this point, the style for the current level is in the cache
        // so return it (as an array!)
        return [styleCache[level]];
    }

    // set values for cgi-script
    para_ud={
        "start_date": return_start,
        "end_date" : return_end, 
        "rp_array" : rp_array
    }

    var rivers_ud;
    $.ajax({
        url: 'cgi-bin/rp_current.py',
        data: para_ud,
        dataType: "json",
        success: function(response) {
            var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(response)
            });
            rivers_ud = new ol.layer.Vector({
                name: "gauges",
                source: vectorSource,
                style: styleFunction,
                map: map_ud
            });
        }
    });
    
    // Change the html header of the panel
    var title = "Historic flood in <b>"  + base_period + "</b>";
    $("#map_hist_title").html(title); 

    // set values for cgi-script
    para_hist={
      "bp_value" : base_period,
      "rp_array" : rp_array
    }

    var rivers_hist;
    $.ajax({
        url: 'cgi-bin/rp_hist.py',
        data: para_hist,
        dataType: "json",
        success: function(response) {
            var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(response)
            });
            rivers_hist = new ol.layer.Vector({
                name: "gauges",
                source: vectorSource,
                style: styleFunction,
                map: map_hist 
            });

        }
    });
  });

}); 
