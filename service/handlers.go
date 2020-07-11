package service

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"sync"
	"text/template"

	"github.com/mar-tina/jene/internal"
)

type TemplateHandler struct {
	Once     sync.Once
	Filename string
	Templ    *template.Template
}

func (t *TemplateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	t.Once.Do(func() {
		t.Templ = template.Must(template.ParseFiles(filepath.Join("templates", t.Filename)))
	})
	t.Templ.Execute(w, nil)
}

func HandleHTTPRequests(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content", "application/json")
	dat, err := ioutil.ReadAll(r.Body)
	if err != nil {
		HandleFailed(w, err, "Failed to read request body. Check your payload for improper inputs")
		return
	}

	ast := [][]string{}
	err = json.Unmarshal(dat, &ast)
	if err != nil {
		HandleFailed(w, err, "Failed to parse payload. Check your payload for improper inputs")
		return
	}

	internal.BuildFile(ast)

	w.Write(dat)
}

func HandleFailed(w http.ResponseWriter, err error, message string) {
	log.Printf("HTTP REQUEST FAILED %v", err.Error())
	res := make(map[string]interface{})
	res["message"] = message
	res["status"] = "failed"

	jsonBytes, err := json.Marshal(res)
	w.Write(jsonBytes)
}
