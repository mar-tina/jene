package main

import "bytes"

type Transactions interface {
	Commit(buf *bytes.Buffer) error
}
