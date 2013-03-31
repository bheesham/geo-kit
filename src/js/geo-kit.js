var gk = (function($, gk){
    
    gk.MODE_INSERT = "insert";
    gk.MODE_SELECT = "select";
    
    gk.Keys = {backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,escape:27,space:32,left:37,up:38,right:39,down:40,w:87,a:65,s:83,d:68,tilde:192};
    
    gk.stages = [];
    gk.currentStage = null;
    gk.mouseLast = {x:0, y:0, down:false};
    gk.mouse = {x:0, y:0, down:false};
    gk.keyboard = {};
    gk.selected = {};
    gk.currentPrimitiveClass = null;
    gk.mode = gk.MODE_INSERT;
    
    $(function(){
        gk.currentPrimitiveClass = gk.primitives[0];
    
        gk.$stages = $("#gk-stages");
        gk.$menu = $("#gk-menu");
        gk.addStage(new gk.Stage());
        
        var $document = $(document);
        
        $document.on("mousedown", ".stage", function(event){
            var canvas = event.target;
            for(var i=0; i<gk.stages.length; ++i){
                var stage = gk.stages[i];
                if(stage.canvas == event.target){
                    gk.setCurrentStage(stage);
                    break;
                } 
            }
            
            gk.currentStage.updateMouse(event, true);
            
            if(gk.mode == gk.MODE_INSERT){
                clearSelection();
                var newPrimitive = gk.currentPrimitiveClass.createPrimitive(gk.mouse);
                gk.currentStage.insert(newPrimitive);
                gk.select(newPrimitive);
            }
            
            gk.currentStage.draw();
                
        });
        
        $document.on("mousemove", ".stage", function(event){
            gk.currentStage.updateMouse(event);
            if(gk.mouse.down){
                for(var key in gk.selected){
                    var item = gk.selected[key];
                    item.updateMouse(gk.mouseLast, gk.mouse);
                }
                gk.currentStage.draw();
            }
        });
        
        $document.on("mouseup", ".stage", function(event){
            gk.currentStage.updateMouse(event, false);
        });
        
        $document.on("keydown", function(event){
            gk.keyboard[event.keyCode] = true;
        });
        
        $document.on("keydown", function(event){
            gk.keyboard[event.keyCode] = false;
        });
    });
    
    gk.setCurrentStage = function(stage){
        if(gk.currentStage){
            gk.currentStage.deselect();
        }
        gk.currentStage = stage;
        gk.currentStage.select();
        
        gk.$menu.empty();
        gk.$menu.append(gk.currentStage.$menu);    
    }
    
    gk.addStage = function(stage){
        gk.stages.push(stage);
        gk.$stages.append(stage.$stage);
        if(gk.stages.length==1){
            gk.setCurrentStage(gk.stages[0]);
        }    
    }
    
    gk.select = function(selection){
        var ctrl = gk.keyboard[gk.Keys.ctrl];
        if(!ctrl){
           clearSelection();
        }
        if(selection.items){
            for(var item in selection){
                if(ctrl && gk.isSelected(item)){
                    removeSelection(item);
                }else{
                    addSelection(item);
                }
            }    
        }else{
            if(ctrl && gk.isSelected(selection)){
                removeSelection(selection);
            }else{
                addSelection(selection);
            }
        }
    }
    
    gk.isSelected = function(item){
        return !!gk.selected[item];
    }
    
    function addSelection(item){
        gk.selected[item] = item;
    }
    
    function removeSelection(item){
        delete gk.selected[item];
    }
    
    function clearSelection(){
        gk.selected = {};
    }

    return gk;
})($, gk || {});
