package internal

import (
	"bytes"
	"fmt"
	"log"
	"os"
	"text/template"
	"time"
)

type JeneInterface interface {
	Commit(txn Transactions) error
	Close() error
	DeclarePkg(name string)
	FlushUse()
	Log(param, info string) string
	Open(filename string, pkg string) error
	SliceNewWithContent(label, kind string, content interface{})
	Use(module string)
	Write(content []byte) error
}

type JeneBuilder struct {
	f       *os.File
	pkg     string
	current int64
	buf     *bytes.Buffer
	modules []string
}

func InstantiateBuilder(filename string, pkg string) *JeneBuilder {
	jenesais := &JeneBuilder{}
	jenesais.Open(filename, pkg)
	return jenesais
}

func (jene *JeneBuilder) Commit(txn Transactions) error {
	buf := &bytes.Buffer{}
	if err := txn.Commit(buf); err != nil {
		return err
	}
	jene.Write(buf.Bytes())
	return nil
}

func (jene *JeneBuilder) Close() error {
	if err := jene.f.Close(); err != nil {
		log.Printf("Could not close file %v", err.Error())
		return err
	}
	return nil
}

func (jene *JeneBuilder) DeclarePkg(name string) {
	now := time.Now()
	jene.Write([]byte(fmt.Sprintf(`// Code generated by go generate; DO NOT EDIT.
// This file was generated by JENE at %v 
package %s
	`, now, name)))
}

func (jene *JeneBuilder) Log(param, info string) string {
	desc := "%v"
	prnt := fmt.Sprintf(`fmt.Printf("%v %v",`, info, desc)
	prnt += param + ")"
	return prnt
}

func (jene *JeneBuilder) Open(filename string, pkg string) error {
	var err error

	// Before creating file. Check if file already exists . If file does not exist create file set the package name.
	_, err = os.Stat(filename)
	if os.IsNotExist(err) {
		log.Printf("File does not exist")
	}

	jene.f, err = os.OpenFile(filename, os.O_RDWR|os.O_CREATE, 0755)
	if err != nil {
		log.Printf("Could not open file %v", err.Error())
		return err
	}

	return nil
}

func (jene *JeneBuilder) SliceNewWithContent(label, kind string, content interface{}) {
	var parseString string
	switch kind {
	case "int":
		parseString = fmt.Sprintf(`var %s = []%s{
{{- range $el := .Values }}
	{{- $el -}},
{{- end}}}`, label, kind)

	case "string":
		parseString = fmt.Sprintf(`var %s = []%s{
{{- range $el := .Values }}
	"{{ $el }}",
{{- end}}
}`, label, kind)
	}

	templ := template.Must(template.New("").Parse(parseString))

	buf := &bytes.Buffer{}
	templ.Execute(buf, struct {
		Timestamp time.Time
		URL       string
		Values    interface{}
	}{
		Timestamp: time.Now(),
		URL:       "here/home",
		Values:    content,
	})

	info := buf.Bytes()
	jene.Write(info)
}

func (jene *JeneBuilder) Use(module string) {
	jene.modules = append(jene.modules, module)
}

func (jene *JeneBuilder) FlushUse() {
	parseString := fmt.Sprintf(`import ( 
{{- range .Imports}}
	"{{ . }}"
{{- end }}
)`)
	templ := template.Must(template.New("").Parse(parseString))

	buf := &bytes.Buffer{}
	templ.Execute(buf, struct {
		Imports interface{}
	}{
		Imports: jene.modules,
	})

	info := buf.Bytes()
	jene.Write(info)
}

func (jene *JeneBuilder) Write(content []byte) error {
	var err error
	jene.f, err = os.OpenFile(jene.f.Name(), os.O_RDWR|os.O_CREATE, 0755)
	if err != nil {
		log.Printf("Could not open file %v", err.Error())
		return err
	}
	defer jene.f.Close()
	content = append(content, []byte("\n\n")...)
	len, err := jene.f.WriteAt(content, jene.current)
	if err != nil {
		log.Printf("Could not write to file %v", err.Error())
		return err
	}

	jene.current += int64(len)
	log.Printf("Wrote %v bytes to file", len)
	return nil
}
