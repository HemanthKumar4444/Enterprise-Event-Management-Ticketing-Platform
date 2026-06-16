package com.eventsphere.controller;

import com.eventsphere.payload.request.BookingRequest;
import com.eventsphere.payload.response.ApiResponse;
import com.eventsphere.payload.response.BookingResponse;
import com.eventsphere.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        BookingResponse response = bookingService.createBooking(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Tickets booked successfully"));
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("bookingDate").descending());
        Page<BookingResponse> bookings = bookingService.getUserBookings(authentication.getName(), pageable);
        return ResponseEntity.ok(ApiResponse.success(bookings, "Bookings fetched successfully"));
    }
}
