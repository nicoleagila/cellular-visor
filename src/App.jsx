import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpDownLeftRight,
  faEraser,
  faPlus,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from "@fortawesome/free-solid-svg-icons";
import papa from "papaparse";
import StopWatch from "./stopwatch/stopwatch";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [isDragging, _setIsDragging] = useState(false);
  const [isAdding, _setIsAdding] = useState(false);
  const [isDraggingBtn, _setIsDraggingBtn] = useState(false);
  const [lastPosX, _setLastPosX] = useState(null);
  const [lastPosY, _setLastPosY] = useState(null);

  const isDraggingRef = React.useRef(isDragging);
  const setIsDragging = (data) => {
    isDraggingRef.current = data;
    _setIsDragging(data);
  };

  const isAddingRef = React.useRef(isAdding);
  const setIsAdding = (data) => {
    isAddingRef.current = data;
    _setIsAdding(data);
  };

  const isDraggingBtnRef = React.useRef(isDraggingBtn);
  const setIsDraggingBtn = (data) => {
    isDraggingBtnRef.current = data;
    _setIsDraggingBtn(data);
  };

  const lastPosXRef = React.useRef(lastPosX);
  const setLastPosX = (data) => {
    lastPosXRef.current = data;
    _setLastPosX(data);
  };

  const lastPosYRef = React.useRef(lastPosY);
  const setLastPosY = (data) => {
    lastPosYRef.current = data;
    _setLastPosY(data);
  };

  //Función para obtener todos los círculos del canvas y exportar a JSON
  const getObjects = () => {
    const circles = canvas.getObjects();
    const res = [];
    circles.forEach((circle) => {
      let dicc = {
        Radius: circle["radius"],
        X: circle["left"],
        Y: circle["top"],
      };
      res.push(dicc);
    });
    exportToJson(res);
  };

  //Función para borrar el canvas con los contenidos relacionados
  const removeCanvas = () => {
    canvas.dispose();
    setFile(null);
    setImage(null);
    setImageUrl(null);
    setCanvas(null);
  };

  //Función para exportar el JSON
  const exportToJson = (objectData) => {
    let filename = "export.json";
    let contentType = "application/json;charset=utf-8;";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob(
        [decodeURIComponent(encodeURI(JSON.stringify(objectData)))],
        { type: contentType }
      );
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      a.download = filename;
      a.href =
        "data:" +
        contentType +
        "," +
        encodeURIComponent(JSON.stringify(objectData));
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  //useEffect que sirve para asociar la tecla suprimir para borrar círculos activos
  useEffect(() => {
    const removeObjects = (e) => {
      if (e.repeat) {
        return;
      }
      if (e.keyCode === 46) {
        if (canvas) {
          canvas.getActiveObjects().forEach((obj) => {
            canvas.remove(obj);
          });
          canvas.discardActiveObject().renderAll();
        }
      }
    };

    var canvasWrapper = document.getElementById("canvasWrap");
    canvasWrapper.tabIndex = 1000;
    canvasWrapper.addEventListener("keyup", (e) => {
      removeObjects(e);
    });
    return () => {
      canvasWrapper.removeEventListener("keyup", (e) => {
        removeObjects(e);
      });
    };
  }, [canvas]);

  //useEffect que sirve para generar un URL de la imagen subida.
  useEffect(() => {
    console.log(image);
    if (image) {
      setImageUrl(URL.createObjectURL(image));
    }
  }, [image]);

  //Función para dibujar los círculos en el canvas una vez subidos tanto la imagen como el archivo JSON/CSV
  useEffect(() => {
    if (canvas && file) {
      for (let i = 0; i < file.length; i++) {
        const x = file[i]["X"];
        const y = file[i]["Y"];
        const r = file[i]["Radius"];
        let circle = new fabric.Circle({
          radius: parseInt(r),
          originX: "center",
          originY: "center",
          fill: "",
          stroke: "red",
          strokeWidth: 3,
          strokeUniform: true,
        });
        circle.setControlsVisibility({ mtr: false });
        circle.top = parseFloat(y);
        circle.left = parseFloat(x);
        canvas.add(circle);
      }
    }
  }, [canvas, file]);

  //Función para generar el canvas una vez subido una imagen
  useEffect(() => {
    const initCanvas = (image) => {
      const height = image.height;
      const width = image.width;
      const canvas = new fabric.Canvas("canvas", {
        height: height,
        width: width,
        backgroundImage: image,
        fireRightClick: true, // <-- enable firing of right click events
        fireMiddleClick: true, // <-- enable firing of middle click events
        stopContextMenu: true, // <--  prevent context menu from showing
        selectionKey: "ctrlKey",
      });

      //Evento para detectar un click y hacer cosas dependiendo del click y otros parámetros
      canvas.on("mouse:down", (e) => {
        var pointer = canvas.getPointer(e.e);
        if (e.button === 3) {
          let circle = new fabric.Circle({
            radius: 20,
            originX: "center",
            originY: "center",
            fill: "",
            stroke: "red",
            strokeWidth: 3,
            top: pointer.y,
            left: pointer.x,
            strokeUniform: true,
          });
          circle.setControlsVisibility({ mtr: false });
          canvas.add(circle);
        } else if (e.button === 1) {
          if (isAddingRef.current === true) {
            let circle = new fabric.Circle({
              radius: 20,
              originX: "center",
              originY: "center",
              fill: "",
              stroke: "red",
              strokeWidth: 3,
              top: pointer.y,
              left: pointer.x,
              strokeUniform: true,
            });
            circle.setControlsVisibility({ mtr: false });
            canvas.add(circle);
          } else {
            if (e.e.altKey === true || isDraggingBtnRef.current) {
              setIsDragging(true);
              setLastPosX(e.e.clientX);
              setLastPosY(e.e.clientY);
            }
          }
        }
      });

      //Evento para detectar la ruedita del ratón y hacer zoom
      canvas.on("mouse:wheel", (opt) => {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 1) zoom = 1;
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();

        var vpt = canvas.viewportTransform;
        if (zoom < 400 / 1000) {
          vpt[4] = 200 - (width * zoom) / 2;
          vpt[5] = 200 - (height * zoom) / 2;
        } else {
          if (vpt[4] >= 0) {
            vpt[4] = 0;
          } else if (vpt[4] < canvas.getWidth() - width * zoom) {
            vpt[4] = canvas.getWidth() - width * zoom;
          }
          if (vpt[5] >= 0) {
            vpt[5] = 0;
          } else if (vpt[5] < canvas.getHeight() - height * zoom) {
            vpt[5] = canvas.getHeight() - height * zoom;
          }
        }
      });

      //Evento para detectar cuando el mouse se mueve dentro del canvas
      canvas.on("mouse:move", function (opt) {
        if (isDraggingRef.current) {
          var zoom = canvas.getZoom();
          var e = opt.e;
          var vpt = canvas.viewportTransform;
          vpt[4] += e.clientX - lastPosXRef.current;
          vpt[5] += e.clientY - lastPosYRef.current;
          if (vpt[4] >= 0) {
            vpt[4] = 0;
          } else if (vpt[4] < canvas.getWidth() - width * zoom) {
            vpt[4] = canvas.getWidth() - width * zoom;
          }
          if (vpt[5] >= 0) {
            vpt[5] = 0;
          } else if (vpt[5] < canvas.getHeight() - height * zoom) {
            vpt[5] = canvas.getHeight() - height * zoom;
          }
          canvas.requestRenderAll();
          setLastPosX(e.clientX);
          setLastPosY(e.clientY);
        }
      });

      //Evento para cuando se suelta el click
      canvas.on("mouse:up", function (opt) {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        canvas.setViewportTransform(canvas.viewportTransform);
        setIsDragging(false);
      });

      return canvas;
    };
    if (imageUrl) {
      fabric.Image.fromURL(imageUrl, (img) => {
        setCanvas(initCanvas(img));
      });
    }
  }, [imageUrl]);

  //Función para hacer zoom un nivel
  const addZoom = () => {
    var zoom = canvas.getZoom();
    zoom = zoom + 0.25;
    if (zoom > 20) {
      zoom = 20;
    }
    canvas.zoomToPoint(
      new fabric.Point(canvas.width / 2, canvas.height / 2),
      zoom
    );
    var vpt = canvas.viewportTransform;
    if (zoom < 400 / 1000) {
      vpt[4] = 200 - (canvas.width * zoom) / 2;
      vpt[5] = 200 - (canvas.height * zoom) / 2;
    } else {
      if (vpt[4] >= 0) {
        vpt[4] = 0;
      } else if (vpt[4] < canvas.getWidth() - canvas.width * zoom) {
        vpt[4] = canvas.getWidth() - canvas.width * zoom;
      }
      if (vpt[5] >= 0) {
        vpt[5] = 0;
      } else if (vpt[5] < canvas.getHeight() - canvas.height * zoom) {
        vpt[5] = canvas.getHeight() - canvas.height * zoom;
      }
    }
  };

  //Función para quitar zoom un nivel
  const substractZoom = () => {
    var zoom = canvas.getZoom();
    zoom = zoom - 0.25;
    if (zoom < 1) {
      zoom = 1;
    }
    canvas.zoomToPoint(
      new fabric.Point(canvas.width / 2, canvas.height / 2),
      zoom
    );
    var vpt = canvas.viewportTransform;
    if (zoom < 400 / 1000) {
      vpt[4] = 200 - (canvas.width * zoom) / 2;
      vpt[5] = 200 - (canvas.height * zoom) / 2;
    } else {
      if (vpt[4] >= 0) {
        vpt[4] = 0;
      } else if (vpt[4] < canvas.getWidth() - canvas.width * zoom) {
        vpt[4] = canvas.getWidth() - canvas.width * zoom;
      }
      if (vpt[5] >= 0) {
        vpt[5] = 0;
      } else if (vpt[5] < canvas.getHeight() - canvas.height * zoom) {
        vpt[5] = canvas.getHeight() - canvas.height * zoom;
      }
    }
  };

  //Función para borrar círculos seleccionados
  const removeObjects = () => {
    canvas.getActiveObjects().forEach((obj) => {
      canvas.remove(obj);
    });
    canvas.discardActiveObject().renderAll();
  };

  return (
    <div className="App">
      <header className="header">
        <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 bg-gray-100">
          <div className="container flex flex-wrap items-center justify-between mx-auto">
            <a href="https://flowbite.com/" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap">
                CelularMI
              </span>
            </a>
          </div>
        </nav>
      </header>
      <div className="body">
        <h1 id="h1-header">Visor de resultados</h1>
        <StopWatch/>
        <div className="btns">
          <label
            type="file"
            className={imageUrl != null ? "btnDisabled" : "btn"}
          >
            Seleccione la imagen
            <input
              type="file"
              accept="image/*"
              className="inputBtn"
              disabled={imageUrl != null ? "disabled" : ""}
              onChange={(e) => {
                setImage(e.target.files[0]);
                e.target.value = null;
              }}
            />
          </label>
          <label
            type="file"
            className={file != null ? "btnDisabled" : "btn"}
          >
            Seleccione el archivo de resultados
            <input
              type="file"
              accept=".csv, .json"
              className="inputBtn"
              disabled={file != null ? "disabled" : ""}
              onChange={(e) => {
                if (e.target.files[0].type === "application/json") {
                  const fileReader = new FileReader();
                  fileReader.readAsText(e.target.files[0], "utf-8");
                  fileReader.onload = (event) => {
                    const content = event.target.result;
                    const res = JSON.parse(content);
                    for (let i = 0; i < res.length; i++) {
                      res[i]["id"] = i;
                    }
                    console.log(res);
                    setFile(JSON.parse(content));
                  };
                } else {
                  papa.parse(e.target.files[0], {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                      for (let i = 0; i < results.data.length; i++) {
                        results.data[i]["id"] = i;
                      }
                      console.log(results.data);
                      setFile(results.data);
                    },
                  });
                }
                e.target.value = null;
              }}
            />
          </label>
        </div>
        <div id="canvasBody">
          {canvas && (
            <div id="toolBar">
              <button
                className={isDraggingBtn ? "toolBarBtnSelected" : "toolBarBtn"}
                onClick={() => {
                  setIsDraggingBtn(!isDraggingBtn);
                }}
              >
                <FontAwesomeIcon icon={faUpDownLeftRight} />
              </button>
              <button className="toolBarBtn">
                <FontAwesomeIcon
                  icon={faEraser}
                  onClick={() => {
                    removeObjects();
                  }}
                />
              </button>
              <button
                className={isAdding ? "toolBarBtnSelected" : "toolBarBtn"}
                onClick={() => {
                  setIsAdding(!isAdding);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                className="toolBarBtn"
                onClick={() => {
                  addZoom();
                }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
              </button>
              <button
                className="toolBarBtn"
                onClick={() => {
                  substractZoom();
                }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              </button>
            </div>
          )}
          <div id="canvasWrap">
            <canvas id="canvas" />
          </div>
        </div>
        <div className="btns">
          {image && file && (
            <button className="btn" onClick={() => getObjects()}>
              Exportar información
            </button>
          )}
          {(image || file) && (
            <button className="btn" onClick={() => removeCanvas()}>
              Escoger una nueva muestra
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
