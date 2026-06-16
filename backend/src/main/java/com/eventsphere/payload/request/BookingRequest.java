package com.eventsphere.payload.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BookingRequest {

    @NotNull
    private UUID eventId;

    @NotNull
    private UUID ticketTypeId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
