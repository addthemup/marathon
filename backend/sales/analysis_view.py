from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import F
from .models import Sale
from .serializers import AnalysisSerializer

class AnalysisView(APIView):
    def get(self, request):
        # Query only the necessary fields from Sale and related models
        sales_data = (
            Sale.objects.select_related(
                'product__brand', 
                'product__category', 
                'product__sub_category',
                'invoice__account',
                'invoice__sales_rep'
            )
            # Removed prefetch for root_accounts since it's causing the error
            .only(
                'id', 'quantity_sold', 'quantity_invoiced', 'sell_price', 'sale_date',
                'product__product_code', 'product__product_description', 'product__brand__name',
                'product__category__name', 'product__sub_category__name', 'invoice__invoice_date',
                'invoice__sales_rep__user__first_name', 'invoice__sales_rep__user__last_name',
                'invoice__account__name'  # Focus on essential fields from Account
            )
        )

        serializer = AnalysisSerializer(sales_data, many=True)
        return Response(serializer.data)
