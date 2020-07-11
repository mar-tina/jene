package internal

import "bytes"

type Transactions interface {
	Commit(buf *bytes.Buffer) error
}

// package main

// import (
// 	"fmt"
// 	"io/ioutil"
// 	"log"
// )

// func main() {
// 	fmt.Println("Hello, WebAssembly!")
// 	data := []byte(`hello wassup`)
// 	WriteToFile(data)
// }

// func WriteToFile(data []byte) {
// 	err := ioutil.WriteFile("tryme.txt", data, 0755)
// 	if err != nil {
// 		log.Printf("Something went wrong %v", err.Error())
// 	}
// }
