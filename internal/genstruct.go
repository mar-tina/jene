package internal

import (
	"bytes"
	"fmt"
	"reflect"
	"text/template"
)

type StructBuilder struct {
	parseString string
}



func (sb *StructBuilder) DeclareStruct(label string, fields map[string]interface{}) {
	sb.parseString = "type " + label + " struct {\n"
	val := reflect.ValueOf(fields)
	for _, k := range val.MapKeys() {
		value := val.MapIndex(k)
		sb.parseString += fmt.Sprintf("\t%v\t%v\n", k, value)
	}

	sb.parseString += "}"
}

func (sb *StructBuilder) Commit(buf *bytes.Buffer) error {
	templ := template.Must(template.New("").Parse(sb.parseString))
	templ.Execute(buf, nil)
	return nil
}
