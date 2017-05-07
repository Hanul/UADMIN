UANI.FADE_IN=METHOD({run:(e,t)=>{e=COPY(e),e.keyframes=KEYFRAMES({from:{opacity:0},to:{opacity:1}}),ANIMATE(e,t)}}),UANI.FADE_OUT=METHOD({run:(e,t)=>{e=COPY(e),e.keyframes=KEYFRAMES({from:{opacity:1},to:{opacity:0}}),ANIMATE(e,t)}}),UANI.HIDE_SLIDE_DOWN=METHOD(e=>{let t={};e.getSavedHeights=(()=>{return t});return{run:(e,n)=>{let o=e.node,i=o.getInnerHeight();e=COPY(e),t[o.id]=i,e.keyframes=KEYFRAMES({from:{marginTop:0,height:i,overflow:o.getStyle("overflow")},to:{marginTop:i,height:0,overflow:"hidden"}}),ANIMATE(e,n)}}}),UANI.HIDE_SLIDE_LEFT=METHOD(e=>{let t={};e.getSavedWidths=(()=>{return t});return{run:(e,n)=>{let o,i=e.node,r=e.width,f=i.getInnerWidth(),d=i.getStyle("marginLeft");e=COPY(e),o=UANI.SHOW_SLIDE_LEFT.getSavedMarginLefts()[i.id],void 0===o&&(o=0),t[i.id]=f,e.keyframes=KEYFRAMES({from:{width:f,marginLeft:void 0===d?0:d,overflow:"hidden"},to:{marginLeft:-(void 0===r?f:r)-o,overflow:"hidden"}}),ANIMATE(e,n)}}}),UANI.HIDE_SLIDE_RIGHT=METHOD(e=>{let t={};e.getSavedWidths=(()=>{return t});return{run:(e,n)=>{let o=e.node,i=e.width,r=o.getInnerWidth(),f=o.getStyle("marginLeft");e=COPY(e),t[o.id]=r,e.keyframes=KEYFRAMES({from:{width:r,marginLeft:void 0===f?0:f,overflow:o.getStyle("overflow")},to:{marginLeft:void 0===i?r:i,overflow:"hidden"}}),ANIMATE(e,n)}}}),UANI.HIDE_SLIDE_UP=METHOD(e=>{let t={},n=e.getSavedHeight=(()=>{return n});return{run:(e,n)=>{let o=e.node,i=o.getInnerHeight();e=COPY(e),t[o.id]=i,e.keyframes=KEYFRAMES({from:{height:i,overflow:o.getStyle("overflow")},to:{height:0,overflow:"hidden"}}),ANIMATE(e,n)}}}),UANI.SHOW_SLIDE_DOWN=METHOD({run:(e,t)=>{let n=e.node,o=n.getInnerHeight();e=COPY(e),0===o&&(o=UANI.HIDE_SLIDE_DOWN.getSavedHeights()[n.id]),e.keyframes=KEYFRAMES({from:{height:0,overflow:"hidden"},to:{height:o,overflow:n.getStyle("overflow")}}),ANIMATE(e,()=>{n.addStyle({height:"auto"}),void 0!==t&&t()})}}),UANI.SHOW_SLIDE_LEFT=METHOD(e=>{let t={};e.getSavedMarginLefts=(()=>{return t});return{run:(e,n)=>{let o=e.node,i=o.getInnerWidth(),r=o.getStyle("marginLeft");e=COPY(e),0===i&&(i=UANI.HIDE_SLIDE_LEFT.getSavedWidths()[o.id]),t[o.id]=r,e.keyframes=KEYFRAMES({from:{width:i,marginLeft:void 0===r?-i:r,overflow:"hidden"},to:{marginLeft:0,overflow:o.getStyle("overflow")}}),ANIMATE(e,n)}}}),UANI.SHOW_SLIDE_RIGHT=METHOD({run:(e,t)=>{let n=e.node,o=n.getInnerWidth(),i=n.getStyle("marginLeft");e=COPY(e),0===o&&(o=UANI.HIDE_SLIDE_RIGHT.getSavedWidths()[n.id]),e.keyframes=KEYFRAMES({from:{width:o,marginLeft:void 0===i?o:i,overflow:"hidden"},to:{marginLeft:0,overflow:n.getStyle("overflow")}}),ANIMATE(e,t)}}),UANI.SHOW_SLIDE_UP=METHOD({run:(e,t)=>{let n=e.node,o=n.getInnerHeight();e=COPY(e),0===o&&(o=UANI.HIDE_SLIDE_UP.getSavedHeights()[n.id]),e.keyframes=KEYFRAMES({from:{marginTop:o,height:0,overflow:"hidden"},to:{marginTop:0,height:o,overflow:n.getStyle("overflow")}}),ANIMATE(e,()=>{n.addStyle({height:"auto"}),void 0!==t&&t()})}});