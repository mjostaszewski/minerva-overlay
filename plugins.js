minervaDefine(function () {
  return {
    register: function (minervaObject) {
      minervaObject.element.innerHTML = "<div><label>Map: </label><input id='model-id'></input><br/><label>P1: </label><input id='left-top-corner'></input><br/><label>P2: </label2><input id='right-bottom-corner'></input><br/><label>Overlays: </label><input id='overlays-id'></input><br/></div>";

      //listeners for bounds change
      var persistBoundsData = function(modelId) {
          var bounds = minervaObject.project.map.getBounds({modelId: modelId});
          $("#model-id",minervaObject.element).val(modelId);
          $("#left-top-corner",minervaObject.element).val(Math.round(bounds.p1.x)+";"+Math.round(bounds.p1.y));
          $("#right-bottom-corner",minervaObject.element).val(Math.round(bounds.p2.x)+";"+Math.round(bounds.p2.y));
	  return minervaObject.pluginData.setUserParam("bounds-"+modelId, Math.round(bounds.p1.x)+";"+Math.round(bounds.p1.y)+" "+Math.round(bounds.p2.x)+";"+Math.round(bounds.p2.y))
      }
      minervaObject.project.map.addListener({
        object: "map",
        type: "onZoomChanged",
        callback: function (data) {
          persistBoundsData(data.modelId);
        }
      });
      minervaObject.project.map.addListener({
        object: "map",
        type: "onCenterChanged",
        callback: function (data) {
          persistBoundsData(data.modelId);
        }
      });


      //listeners for selected data overlays change
      var persistOverlayData = function() {
          return minervaObject.project.map.getVisibleDataOverlays().then(function(overlays){
            var ids = "";
            for (var i=0;i<overlays.length;i++) {
              ids+=overlays[i].getId()+",";
            }
            $("#overlays-id",minervaObject.element).val(ids);
	    return minervaObject.pluginData.setUserParam("visible-overlays", ids)
          });;
      }
      minervaObject.project.map.addListener({
        object: "overlay",
        type: "onHide",
        callback: function () {
          persistOverlayData();
        }
      });
      minervaObject.project.map.addListener({
        object: "overlay",
        type: "onShow",
        callback: function () {
          persistOverlayData();
        }
      });

      //and now setup initial values
      return persistOverlayData().then(function(){
        return persistBoundsData(minervaObject.project.data.getModels()[0].modelId);
      });
    },
    unregister: function () {
    },
    getName: function () {
      return "vizAR";
    },
    getVersion: function () {
      return "0.0.1";
    }
  };
});
