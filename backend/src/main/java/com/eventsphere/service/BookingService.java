package com.eventsphere.service;

import com.eventsphere.entity.*;
import com.eventsphere.exception.BadRequestException;
import com.eventsphere.exception.ResourceNotFoundException;
import com.eventsphere.payload.request.BookingRequest;
import com.eventsphere.payload.response.BookingResponse;
import com.eventsphere.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", request.getEventId()));

        TicketType ticketType = ticketTypeRepository.findById(request.getTicketTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("TicketType", "id", request.getTicketTypeId()));

        if (!ticketType.getEvent().getId().equals(event.getId())) {
            throw new BadRequestException("Ticket type does not belong to the specified event");
        }

        if (ticketType.getAvailableQuantity() < request.getQuantity()) {
            throw new BadRequestException("Not enough tickets available");
        }

        // Optimistic Locking will ensure that if another thread updates the ticketType simultaneously, an ObjectOptimisticLockingFailureException will be thrown.
        ticketType.setAvailableQuantity(ticketType.getAvailableQuantity() - request.getQuantity());
        ticketTypeRepository.save(ticketType);

        BigDecimal totalAmount = ticketType.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .totalAmount(totalAmount)
                .status("CONFIRMED")
                .build();

        for (int i = 0; i < request.getQuantity(); i++) {
            Ticket ticket = Ticket.builder()
                    .booking(booking)
                    .ticketType(ticketType)
                    .qrCodeHash(UUID.randomUUID().toString()) // Mock QR code hash
                    .status("VALID")
                    .build();
            booking.getTickets().add(ticket);
        }

        Booking savedBooking = bookingRepository.save(booking);
        return BookingResponse.fromEntity(savedBooking);
    }

    public Page<BookingResponse> getUserBookings(String email, Pageable pageable) {
        return bookingRepository.findByUserEmail(email, pageable)
                .map(BookingResponse::fromEntity);
    }
}
