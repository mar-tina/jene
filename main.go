// The following directive is necessary to make the package coherent:

// +build ignore

// This program generates contributors.go. It can be invoked by running
// go generate
package main

import (
	"net/http"

	"github.com/gorilla/websocket"
	internal "github.com/mar-tina/jene/internal"
	"github.com/mar-tina/jene/service"
)

var BuildJene internal.JeneInterface

func main() {
	InstantiateBuilder("trying.go", "trying")
	BuildJene.DeclarePkg("main")
	var Oceans = []string{
		"Arctic",
		"Southen",
		"Indian",
		"Atlantic",
		"Pacific",
	}
	var randos = []int{1, 2, 3, 4, 5, 6, 7, 8}

	// Adding imports
	BuildJene.Use("fmt")

	// Commiting imports
	BuildJene.FlushUse()

	// Params. Function input params
	params := make(map[string]interface{})
	params["x"] = "int"
	params["y"] = "string"
	f := internal.NewFunc("test", "int", params)

	// Declare function variables
	f.Declare("book", "string", "")
	f.Declare("otherbook", "string", "Dirty Code")
	f.Declare("counter", "int", "")

	// Statements to be executed
	f.StateEq("book", "otherbook")
	f.State(BuildJene.Log("book", "This book is called "), BuildJene.Log("counter", "Your book is called "), "return 0")

	// End of the function and Commit writes to file
	f.End()
	BuildJene.Commit(f)
	BuildJene.SliceNewWithContent("oceans", "string", Oceans)
	BuildJene.SliceNewWithContent("randos", "int", randos)
	NewWebServer("8999")
}

func InstantiateBuilder(filename string, pkg string) {
	BuildJene = &internal.JeneBuilder{}
	BuildJene.Open(filename, pkg)
}

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
}

func NewWebServer(port string) {
	fs := http.FileServer(http.Dir("templates/assets"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.HandleFunc("/serv", service.HandleHTTPRequests)
	http.Handle("/", &service.TemplateHandler{Filename: "index.html"})
	http.ListenAndServe(":"+port, nil)
}
