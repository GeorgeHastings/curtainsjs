window.onload = function(){
    // we will keep track of the scroll
    var scrollValue = 0;
    var lastScrollValue = 0;

    // set up our WebGL context and append the canvas to our wrapper
    var webGLCurtain = new Curtains("canvas");

    webGLCurtain.onRender(function() {
        // update our planes deformation
        // increase/decrease the effect
        if(planesDeformations >= 0) {
            planesDeformations = Math.max(0, planesDeformations - 1);
        }
        else {
            planesDeformations = Math.min(0, planesDeformations + 1);
        }
    }).onError(function() {
        // we will add a class to the document body to display original images
        document.body.classList.add("no-curtains", "planes-loaded");
    });

    // we will keep track of all our planes in an array
    var planes = [];
    var planesDeformations = 0;

    // get our planes elements
    var planeElements = document.getElementsByClassName("plane");

    // all planes will have the same parameters
    // we don't need to specifiate vertexShaderID and fragmentShaderID because we already passed it via the data attributes of the plane HTML element
    var params = {
        widthSegments: 10,
        heightSegments: 10,
        uniforms: {
            planeDeformation: {
                name: "uPlaneDeformation",
                type: "1f",
                value: 0,
            },
        }
    }

    // add our planes and handle them
    for(var i = 0; i < planeElements.length; i++) {
        planes.push(webGLCurtain.addPlane(planeElements[i], params));

        handlePlanes(i);
    }

    // listen to scroll
    window.addEventListener("scroll", function(e) {
        lastScrollValue = scrollValue;
        scrollValue = window.pageYOffset;

        var delta = scrollValue - lastScrollValue;
        // threshold
        if(delta > 60) {
            delta = 60;
        }
        else if(delta < -60) {
            delta = -60;
        }

        if(Math.abs(delta) > Math.abs(planesDeformations)) {
            planesDeformations = delta;
        }

        // update the plane positions during scroll
        for(var i = 0; i < planes.length; i++) {
            planes[i].updatePosition();
        }
    });


    // handle all the planes
    function handlePlanes(index) {
        var plane = planes[index];

        // check if our plane is defined and use it
        plane && plane.onLoading(function() {
            //console.log(plane.loadingManager.sourcesLoaded);
        }).onReady(function() {
            // once everything is ready, display everything
            if(index == planes.length - 1) {
                document.body.classList.add("planes-loaded");
            }
        }).onRender(function() {
            // update the uniform
            plane.uniforms.planeDeformation.value = planesDeformations;
        });
    }

    // this will simulate an ajax lazy load call
    // additionnalPlanes string could be the response of our AJAX call
    document.getElementById("add-more-planes").addEventListener("click", function() {
        var additionnalPlanes = '<div class="plane-wrapper"><span class="plane-title">Title ' + (planes.length + 1) + '</span><div class="plane-inner"><div class="landscape-wrapper"><div class="landscape-inner"><div class="plane" data-vs-id="multiple-planes-vs" data-fs-id="multiple-planes-fs"><img src="../medias/plane-small-texture-1.jpg" data-sampler="planeTexture" /></div></div></div></div></div><div class="plane-wrapper"><span class="plane-title">Title ' + (planes.length + 2) + '</span><div class="plane-inner"><div class="landscape-wrapper"><div class="landscape-inner"><div class="plane" data-vs-id="multiple-planes-vs" data-fs-id="multiple-planes-fs"><img src="../medias/plane-small-texture-2.jpg" data-sampler="planeTexture" /></div></div></div></div></div><div class="plane-wrapper"><span class="plane-title">Title ' + (planes.length + 3) + '</span><div class="plane-inner"><div class="landscape-wrapper"><div class="landscape-inner"><div class="plane" data-vs-id="multiple-planes-vs" data-fs-id="multiple-planes-fs"><img src="../medias/plane-small-texture-3.jpg" data-sampler="planeTexture" /></div></div></div></div></div><div class="plane-wrapper"><span class="plane-title">Title ' + (planes.length + 4) + '</span><div class="plane-inner"><div class="landscape-wrapper"><div class="landscape-inner"><div class="plane" data-vs-id="multiple-planes-vs" data-fs-id="multiple-planes-fs"><img src="../medias/plane-small-texture-4.jpg" data-sampler="planeTexture" /></div></div></div></div></div>';

        // append the response
        document.getElementById("planes").insertAdjacentHTML("beforeend", additionnalPlanes);

        // reselect our plane elements
        planeElements = document.getElementsByClassName("plane");

        // we need a timeout because insertAdjacentHTML could take some time to append the content
        setTimeout(function() {
            // we will create the planes that don't already exist
            // basically the same thing as above
            for(var i = planes.length; i < planeElements.length; i++) {

                planes.push(webGLCurtain.addPlane(planeElements[i], params));

                handlePlanes(i);

                // 30 planes are enough, right ?
                if(planes.length >= 28) {
                    document.getElementById("add-more-planes").style.display = "none";
                }
            }
        }, 50);

    });
}
