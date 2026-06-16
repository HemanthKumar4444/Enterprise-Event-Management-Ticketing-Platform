package com.eventsphere.controller;

import com.eventsphere.payload.request.EventRequest;
import com.eventsphere.payload.response.ApiResponse;
import com.eventsphere.payload.response.EventResponse;
import com.eventsphere.service.EventService;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventRequest request, Authentication authentication) {
        EventResponse response = eventService.createEvent(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(response, "Event created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EventResponse>>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
            
        Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").ascending());
        Page<EventResponse> events;
        
        if ((search != null && !search.isEmpty()) || (category != null && !category.isEmpty())) {
            events = eventService.searchEvents(search != null ? search : "", category != null ? category : "", pageable);
        } else {
            events = eventService.getAllPublishedEvents(pageable);
        }
        
        return ResponseEntity.ok(ApiResponse.success(events, "Events fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getEventById(id), "Event fetched successfully"));
    }

    @GetMapping("/organizer")
    @PreAuthorize("hasRole('ORGANIZER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page<EventResponse>>> getEventsByOrganizer(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EventResponse> events = eventService.getEventsByOrganizer(authentication.getName(), pageable);
        return ResponseEntity.ok(ApiResponse.success(events, "Organizer events fetched successfully"));
    }
}
