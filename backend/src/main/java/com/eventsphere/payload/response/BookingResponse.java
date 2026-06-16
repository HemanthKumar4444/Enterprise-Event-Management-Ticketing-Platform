package com.eventsphere.payload.response;

import com.eventsphere.entity.Booking;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class BookingResponse {
    private UUID id;
    private UUID eventId;
    private String eventName;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime bookingDate;
    private Integer ticketCount;

    public static BookingResponse fromEntity(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .eventId(booking.getEvent().getId())
                .eventName(booking.getEvent().getName())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .bookingDate(booking.getBookingDate())
                .ticketCount(booking.getTickets() != null ? booking.getTickets().size() : 0)
                .build();
    }
}
