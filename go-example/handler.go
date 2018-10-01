package main

import (
	"context"
	"log"

	"go.cryptoscope.co/muxrpc"
)

type exampleHandler struct{}

func (h exampleHandler) HandleCall(ctx context.Context, req *muxrpc.Request, _ muxrpc.Endpoint) {
	log.Printf("got called: M:%v Args:%v", req.Method, req.Args)
}

func (h exampleHandler) HandleConnect(ctx context.Context, e muxrpc.Endpoint) {
	/* calling back
	ret, err := e.Async(ctx, "str", []string{"whoami"})
	if err != nil {
		h.log.Log("handleConnect", "whoami", "err", err)
		return
	}
	*/
}
