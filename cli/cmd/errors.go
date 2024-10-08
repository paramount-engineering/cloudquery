package cmd

import (
	"fmt"
	"io"

	"google.golang.org/grpc/status"
)

func handleSendError(err error, client safeWriteClient, msgType string) error {
	if err == io.EOF {
		// we need to get back the original error
		if _, err := client.CloseAndRecv(); err != nil {
			if e, ok := status.FromError(err); ok {
				return fmt.Errorf("write client returned error (%v): %v", msgType, e.Message())
			}
			return fmt.Errorf("failed to close and receive write client (%v): %v", msgType, err)
		}
	}
	return fmt.Errorf("failed to send write request (%v): %w", msgType, err)
}
