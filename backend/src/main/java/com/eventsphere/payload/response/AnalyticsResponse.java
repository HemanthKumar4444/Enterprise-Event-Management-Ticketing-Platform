package com.eventsphere.payload.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AnalyticsResponse {
    private BigDecimal totalRevenue;
    private Long totalAttendees;
}
