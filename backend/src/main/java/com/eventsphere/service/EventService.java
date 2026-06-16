package com.eventsphere.service;

import com.eventsphere.entity.Event;
import com.eventsphere.entity.TicketType;
import com.eventsphere.entity.User;
import com.eventsphere.entity.Venue;
import com.eventsphere.exception.ResourceNotFoundException;
import com.eventsphere.payload.request.EventRequest;
import com.eventsphere.payload.response.EventResponse;
import com.eventsphere.repository.EventRepository;
import com.eventsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public EventResponse createEvent(EventRequest request, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", organizerEmail));

        Event event = Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .bannerUrl(request.getBannerUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status("PUBLISHED") // Default to published for now
                .capacity(request.getCapacity())
                .organizer(organizer)
                .build();

        Venue venue = Venue.builder()
                .name(request.getVenue().getName())
                .address(request.getVenue().getAddress())
                .city(request.getVenue().getCity())
                .state(request.getVenue().getState())
                .zipCode(request.getVenue().getZipCode())
                .country(request.getVenue().getCountry())
                .build();
        event.setVenue(venue);

        if (request.getTicketTypes() != null) {
            event.setTicketTypes(request.getTicketTypes().stream().map(tt -> TicketType.builder()
                    .name(tt.getName())
                    .price(tt.getPrice())
                    .totalQuantity(tt.getQuantity())
                    .availableQuantity(tt.getQuantity())
                    .event(event)
                    .build()).collect(Collectors.toList()));
        }

        Event savedEvent = eventRepository.save(event);
        return EventResponse.fromEntity(savedEvent);
    }

    public Page<EventResponse> getAllPublishedEvents(Pageable pageable) {
        return eventRepository.findByStatus("PUBLISHED", pageable)
                .map(EventResponse::fromEntity);
    }

    public Page<EventResponse> searchEvents(String search, String category, Pageable pageable) {
        return eventRepository.searchEvents("PUBLISHED", search, category, pageable)
                .map(EventResponse::fromEntity);
    }

    public EventResponse getEventById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return EventResponse.fromEntity(event);
    }

    public Page<EventResponse> getEventsByOrganizer(String email, Pageable pageable) {
        return eventRepository.findByOrganizerEmail(email, pageable)
                .map(EventResponse::fromEntity);
    }
}
