// The following directive is necessary to make the package coherent:

// +build ignore

// This program generates contributors.go. It can be invoked by running
// go generate
package main

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/elliotchance/orderedmap"
	internal "github.com/mar-tina/jene/internal"
	"github.com/mar-tina/jene/service"
)

func main() {
	jen := internal.InstantiateBuilder("trying.go", "trying")
	jen.DeclarePkg("main")
	var Oceans = []string{
		"Arctic",
		"Southen",
		"Indian",
		"Atlantic",
		"Pacific",
	}
	var randos = []int{1, 2, 3, 4, 5, 6, 7, 8}

	var vals = []string{
		"Arctic,int",
		"Southen,string",
		"Indian,int",
		"Atlantic,string",
		"Pacific,int",
	}
	// Adding imports
	jen.Use("fmt")
	jen.Use("strings")
	// Commiting imports
	jen.FlushUse()

	// Params. Function input params
	params := orderedmap.NewOrderedMap()
	for _, arg := range vals {
		splitString := strings.SplitN(arg, ",", 2)
		params.Set(fmt.Sprintf("%s", splitString[0]), splitString[1])
	}
	f := internal.NewFunc("test", "int", params)

	// Declare function variables
	f.Declare("book", "string", "")
	f.Declare("otherbook", "string", "Dirty Code")
	f.Declare("counter", "int", "")
	f.StateEq("bike", "Pacific")

	//Loop Range
	f.LRange("_", "arg", `strings.Split(otherbook, " ")`)
	f.State(jen.Log("arg", "This is not fun"))
	f.EndLRange()

	fparams := orderedmap.NewOrderedMap()
	fparams.Set("first", 1)
	fparams.Set("second", "see")
	fparams.Set("third", 2)
	fparams.Set("fourth", "sea")
	fparams.Set("fifth", 4)
	f.Call("test", fparams)

	test := []string{"hiiiii"}
	f.RCall("test", test, fparams, false)
	// Statements to be executed
	f.StateEq("book", "otherbook")
	f.State(jen.Log("hiiiii", "Well hello there"))
	f.State(jen.Log("book", "This book is called "), jen.Log("counter", "Your book is called "), jen.Log("bike", "This is a bike "), "return 0")

	// End of the function and Commit writes to file
	f.End()
	jen.Commit(f)

	//Building a struct
	rd := make(map[string]interface{})
	rd["home"] = "string"
	rd["away"] = "int"
	sbuilder := &internal.StructBuilder{}
	sbuilder.DeclareStruct("Fun", rd)
	jen.Commit(sbuilder)

	jen.SliceNewWithContent("oceans", "string", Oceans)
	jen.SliceNewWithContent("randos", "int", randos)
	NewWebServer("8999")
}

func NewWebServer(port string) {
	fs := http.FileServer(http.Dir("templates/assets"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.HandleFunc("/serv", service.HandleHTTPRequests)
	http.Handle("/", &service.TemplateHandler{Filename: "index.html"})
	http.ListenAndServe(":"+port, nil)
}
