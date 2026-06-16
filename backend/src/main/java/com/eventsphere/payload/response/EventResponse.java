package com.eventsphere.payload.response;

import com.eventsphere.entity.Event;
import com.eventsphere.entity.TicketType;
import com.eventsphere.entity.Venue;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class EventResponse {
    private UUID id;
    private String name;
    private String description;
    private String category;
    private String bannerUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Integer capacity;
    private VenueResponse venue;
    private List<TicketTypeResponse> ticketTypes;
    private OrganizerResponse organizer;

    public static EventResponse fromEntity(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .category(event.getCategory())
                .bannerUrl(event.getBannerUrl())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .status(event.getStatus())
                .capacity(event.getCapacity())
                .venue(VenueResponse.fromEntity(event.getVenue()))
                .ticketTypes(event.getTicketTypes().stream().map(TicketTypeResponse::fromEntity).collect(Collectors.toList()))
                .organizer(OrganizerResponse.fromEntity(event.getOrganizer()))
                .build();
    }

    @Data
    @Builder
    public static class VenueResponse {
        private String name;
        private String address;
        private String city;
        private String state;
        private String zipCode;
        private String country;

        public static VenueResponse fromEntity(Venue venue) {
            if (venue == null) return null;
            return VenueResponse.builder()
                    .name(venue.getName())
                    .address(venue.getAddress())
                    .city(venue.getCity())
                    .state(venue.getState())
                    .zipCode(venue.getZipCode())
                    .country(venue.getCountry())
                    .build();
        }
    }

    @Data
    @Builder
    public static class TicketTypeResponse {
        private UUID id;
        private String name;
        private java.math.BigDecimal price;
        private Integer totalQuantity;
        private Integer availableQuantity;

        public static TicketTypeResponse fromEntity(TicketType ticketType) {
            if (ticketType == null) return null;
            return TicketTypeResponse.builder()
                    .id(ticketType.getId())
                    .name(ticketType.getName())
                    .price(ticketType.getPrice())
                    .totalQuantity(ticketType.getTotalQuantity())
                    .availableQuantity(ticketType.getAvailableQuantity())
                    .build();
        }
    }

    @Data
    @Builder
    public static class OrganizerResponse {
        private UUID id;
        private String firstName;
        private String lastName;

        public static OrganizerResponse fromEntity(com.eventsphere.entity.User user) {
            if (user == null) return null;
            return OrganizerResponse.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .build();
        }
    }
}
